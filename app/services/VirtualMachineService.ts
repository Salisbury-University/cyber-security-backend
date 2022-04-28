import { PrismaClient, VM } from ".prisma/client";
import axios from "axios";
import { marked } from "marked";
import fs from "fs";
import https from "https";
import { config } from "../../config";
import InsufficientStorageException from "../exceptions/InsufficientStorageException";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  /**
   * Check if VM timeEnd with current time
   *
   * @param {VM} VM virtual machine databse for currently running
   * @return {boolean} returns true if the time is earlier than current time
   */
  checkTimeEnd(VMinfo: VM): boolean {
    if (VMinfo.timeEnd < new Date()) return false;
    return true;
  },

  /**
   * Checks if the user already has a VM running
   * Terminates if time ended
   *
   * @param {string} user user currently logged in
   * @throw Error on already existing VM
   * */
  async checkRunningVM(user: string): Promise<void> {
    const VM = await prisma.vM.findFirst({
      where: {
        user: user,
      },
    });
    // VM data is stored or running
    if (VM != null) {
      // Double checking and terminating if VM is running
      if (this.checkTimeEnd(VM)) {
        this.checkVMExist(VM["vmid"], VM["node"]);
      } else {
        //Throw error saying already running
      }
    }
  },

  /**
   * Check if the VM exist in the server
   *
   * @param {string} vmid vmid of vm
   * @param {string} node node where the vm is stored
   */
  checkVMExist(vmid: string, node: string): void {
    axios
      .get(
        config.app.node.concat(
          "/api2/json/",
          node,
          "/qemu/",
          vmid,
          "/status/current"
        )
      )
      .then((res) => {
        if (res.data.status == "") {
          return;
        }
        if (res.data.status == "running") {
          this.stopVM(vmid, node);
        }
        this.unlinkVM(vmid, node);
      });
  },

  /**
   * Force stop the running VM
   *
   * @param {string} vmid vmid of VM
   * @param {string} node node where the vm is stored
   */
  stopVM(vmid: string, node: string): void {
    axios.post(
      config.app.node.concat(
        "/api2/json/",
        node,
        "/qemu/",
        vmid,
        "/status/stop"
      )
    );
  },

  /**
   * Delete the VM
   *
   * @param {string} vmid vmid of VM
   * @param {string} node node where the vm is stored
   */
  unlinkVM(vmid: string, node: string): void {
    axios.put(
      config.app.node.concat(
        "/api2/json/",
        node,
        "/qemu/",
        vmid,
        "/unlink?force=true"
      )
    );
  },

  /**
   * Creates the VM
   *
   * @param {string} user current user
   * @param {string} vmid vmid of vm
   * @return error from function
   */
  async createVM(user: string, vmid: string): Promise<JSON> {
    try {
      const load = this.selectNodeLoad(vmid);
      const newNode = load[0];
      const newId = load[1];
      this.cloneTemplate(vmid, newId);
      this.migrateTemplate(newId, newNode);
      this.startVM(newId, newNode);
      // Wait for 30 sec OS to boot for guest agent to run
      await new Promise((r) => setTimeout(r, 30000));
    } catch (e) {
      return e;
    }
  },

  /**
   * Starts the virtual machine
   *
   * @param {string} vmid id of vm
   * @param {string} node node where vm is located at
   */
  startVM(vmid: string, node: string) {
    axios.post(
      config.app.node.concat(
        "/api2/json/",
        node,
        "/qemu/",
        vmid,
        "/status/start"
      )
    );
  },

  /**
   * Migrates virtual machine to newNode
   *
   * @param {string} newId Id of newly created virtual machine
   * @throw Error during migration
   * */
  migrateTemplate(newId: string, newNode: string): void {
    axios
      .post(
        config.app.node.concat(
          "/api2/json/nodes",
          config.app.node,
          "/qemu/",
          newId,
          "/migrate?target=",
          newNode
        )
      )
      .catch((error) => {
        // Throw error if fails to migrate
      });
  },

  /**
   * Clones the Template to current Node
   *
   * @param {string} vmid Virtual Machine ID
   * */
  cloneTemplate(vmid: string, newId: string): void {
    console.log(config.app.token);
    axios
      .post(
        config.app.node.concat(
          "/api2/json/nodes/",
          config.app.nodename,
          "/qemu/",
          vmid,
          "/clone?newid=",
          newId
        ),
        {
          headers: {
            Authorization: config.app.token,
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      )
      .catch((error) => {
        console.log(error);
      });
  },

  /**
   * Checks the load by VM running and
   *
   * @param {string} vmid number of vmid to clone
   * @return {string} return the node that the template should be cloned to
   */
  selectNodeLoad(vmid: string): string[] {
    // Gets the list of node (includes node name / cpu usage / disk avaliable)
    const node: string[] = [];
    const disk: number[] = [];
    const cpu: number[] = [];
    const vm: number[] = [];
    const vmId: number[] = [];

    axios.post(config.app.node.concat("/api2/json/nodes")).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        node.push(res.data[i].node);
        // Calculate disk avaliable and push to array
        disk.push(res.data[i].maxdisk - res.data[i].disk);
        cpu.push(res.data[i].cpu);

        // Get vm running per node
        axios
          .post(
            config.app.node.concat(
              "/api2/json/nodes/",
              res.data[i].node,
              "/qemu"
            )
          )
          .then((res) => {
            vm.push(0);
            for (let j = 0; j < res.data.length; j++) {
              if (res.data[i].status === "running") {
                vm[i]++;
              }
              if (res.data[i].vmid >= 1000) {
                vmId.push(res.data[i].vmid);
              }
            }
          });
      }
    });

    // Get the new id
    const newId = this.checkNewVMID(vmId);

    // Get the size of template
    const size = this.getSizeTemplate(vmid);

    // Check each node disk storage size to see if template can be clones
    // Otherwise remove it from the array
    for (let i = 0; i < disk.length; i++) {
      if (size > disk[i]) {
        disk.splice(i, 1);
        cpu.splice(i, 1);
        vm.splice(i, 1);
        node.splice(i, 1);
      }
    }

    // If no storage is free, send error
    if (disk.length < 1) {
      throw new InsufficientStorageException();
    }

    // Check least running vm or if all are the same
    let sameVM = true;
    let index = 0;
    for (let i = 1; i < vm.length; i++) {
      if (sameVM) {
        if (vm[index] != vm[i]) {
          sameVM = false;
        }
      }
      if (sameVM == false) {
        if (vm[index] > vm[i]) {
          index = i;
        }
      }
    }

    // If all the same number of running vm check by cpu usage
    if (sameVM) {
      for (let i = 1; cpu.length; i++) {
        if (cpu[index] > cpu[i]) {
          index = i;
        }
      }
    }

    // Return the name of the least node
    return [node[index], String(newId)];
  },

  /**
   * Gets the disk size of template
   *
   * @param {string} vmid The vmid of template
   * @return {any} size of the template
   */
  getSizeTemplate(vmid: string): any {
    return axios
      .post(
        config.app.node.concat(
          "/api2/json/nodes/",
          config.app.node,
          "/qemu/",
          vmid,
          "config"
        )
      )
      .then((res) => {
        for (var key in res.data) {
          //Checks for ide only goes 0-3
          if (key.includes("ide")) {
            const split = res.data[key].split("size=");
            if (split.length > 2) {
              continue;
            } else {
              // Last letter is G (gigabyte): hit the jackpot
              const lastLetter = split[1].length - 1;
              if (split[1][lastLetter] == "G") {
                const stringSize = split[1].substring(0, lastLetter);
                return Number(stringSize) * Math.pow(2, 30) * 8;
              }
            }
          }
          //Check scsi key only goes 0-30
          if (key.includes("scsi")) {
            const split = res.data[key].split("size=");
            if (split.length > 2) {
              continue;
            } else {
              // Last letter is G (gigabyte): hit the jackpot
              const lastLetter = split[1].length - 1;
              if (split[1][lastLetter] == "G") {
                const stringSize = split[1].substring(0, lastLetter);
                return Number(stringSize) * Math.pow(2, 30) * 8;
              }
            }
          }
        }
      });
  },

  /**
   * checks the next lowest number to use for newId
   *
   * @param {number []} vmid array storing vmid
   * @return {number} newId to use for cloning
   */
  checkNewVMID(vmid: number[]): number {
    let newId = 1000;
    vmid.sort();
    for (let i = 0; i < vmid.length; i++) {
      if (newId == vmid[i]) {
        newId++;
        continue;
      }
      return newId;
    }
  },

  /**
   * Gets the front matter from the md file
   *
   * @param vmid id of vm
   * @return JSON formated string
   */
  getMetaData(vmid: string): string {
    const fileLocation = "exercises/" + vmid + ".md";
    const fileContent = fs.readFileSync(fileLocation, "utf8");
    const lexer = marked.lexer(fileContent);
    let content = "";
    for (let i = 0; i < lexer.length; i++) {
      if (lexer[i].type == "hr") {
        content = lexer[i + 1].text;
        break;
      }
    }
    //Object to store the key and value
    const metadata = {};

    //Split by enter and get rid of last
    const eachRow = content.split("\n");
    for (let i = 0; i < eachRow.length; i++) {
      // Split between key and value
      const eachCol = eachRow[i].split(": ");
      metadata[eachCol[0]] = this.getDataType(eachCol[1]);
    }
    console.log(metadata);

    return JSON.stringify(metadata);
  },

  /**
   * Gets the string and parses it to different type
   *
   * @param {string} s string that one wish to convert
   * @return the string in different dataType
   */
  getDataType(s: string): any {
    if (s.startsWith("{") && s.endsWith("}")) {
      return Object(s);
    } else if (s.indexOf("/") !== -1 && !isNaN(Date.parse(s))) {
      return Date.parse(s);
    } else if (!isNaN(parseFloat(s))) {
      return Number(s);
    } else if (s.startsWith("[") && s.endsWith("]")) {
      s = s.substring(1, s.length - 1);
      const split = s.split(", ");
      for (let i = 0; i < split.length; i++) {
        // Gets rid of double quotation
        split[i] = split[i].substring(1, split[i].length - 1);
      }
      return split;
    } else if (s.toLowerCase() == "true" || s.toLowerCase() == "false") {
      return Boolean(s);
    } else {
      // Gets rid of double quotation
      s = s.substring(1, s.length - 1);
      return s;
    }
  },
};
