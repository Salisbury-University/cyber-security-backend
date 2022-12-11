import axios from "axios";
import { config } from "../../config";

export const VirtualMachineService = {
  /**
   * Opens up the websocket for the virtual machine
   *
   * @param {string} node - the cluster node that the virtual machine is in
   * @param {string} vmid - The virtual machine number id
   * @returns {string}    - port number that it is being opened
   */
  async getVNCWebsocket(node: string, vmid: string): Promise<string> {
    console.log("vncwebsocket");

    return await this.createAxiosWithToken()
      .post(
        config.app.url.concat(
          "/api2/json/nodes/",
          node,
          "/qemu/",
          vmid,
          "/vncproxy?websocket=1"
        )
      )
      .then(async (res) => {
        const data = res.data.data;
        const access = await axios
          .create()
          .post(
            config.app.url.concat(
              "/api2/json/access/ticket?",
              "username=",
              config.app.novncUser,
              "&password=",
              config.app.novncPass
            )
          )
          .then((res) => {
            const accessData = res.data.data;
            return accessData;
          });

        return {
          ...data,
          url: config.app.url.split("https://")[1],
          node: node,
          vmid: vmid,
          access: { ...access },
        };

        // // Need the port and ticket
        // const port = data.port;
        // // Need to convert into url friendly
        // const ticket = encodeURIComponent(data.ticket);

        // const wsUrl = 'ws'+config.app.url.split('https')[1];
        // console.log(wsUrl)
        // const wss = new WebSocket(wsUrl.concat(
        //     "/api2/json/nodes/",
        //     node,
        //     "/qemu/",
        //     vmid,
        //     "/vncwebsocket?",
        //     "port=",
        //     port,
        //     "&vncticket=",
        //     ticket)
        // )

        // wss.on('connection', wss=>{
        //     console.log('client connected');
        // })

        // return await this.createAxiosWithToken()
        // .get(config.app.url.concat(
        //     "/api2/json/nodes/",
        //     node,
        //     "/qemu/",
        //     vmid,
        //     "/vncwebsocket?",
        //     "port=",
        //     port,
        //     "&vncticket=",
        //     ticket
        // ))
        // .then((res)=>{
        //     return res.data.data;
        // })
      });
  },
  createAxiosWithToken(): any {
    return axios.create({
      headers: {
        Authorization: config.app.token,
      },
    });
  },
};
