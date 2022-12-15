import axios from "axios";
import InvalidCredentialException from "../exceptions/InvalidCredentials";
import { config } from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import JwtMalformedException from "../exceptions/JwtMalformedException";
import { PrismaClient, Users } from "@prisma/client";
import ldapjs from "ldapjs";

const prisma = new PrismaClient();
/**
 * All of the functions regarding authorization
 */
export const AuthService = {
  /**
   * Checks if the token starts with Bearer(JWT token) and a spcae afterward
   *
   * @param {String} token Authorization token attached to the HTTP header.
   * @return {boolean} True if their token is valid, false if it isn't.
   */
  validate(token: String): boolean {
    // Space for to check for two words
    const tokenHeader = "Bearer" + " ";
    if (token.startsWith(tokenHeader)) {
      return true;
    }
    return false;
  },

  /**
   *  Verifiy token that returns decoded token
   *
   * @param {String} token Jwt token that was created during login
   * @returns {User} decoded token
   */
  verifyToken(token: String): User {
    try {
      const verified = jwt.verify(token, config.app.secret);
      return verified;
    } catch (e) {
      throw new JwtMalformedException();
    }
  },

  /**
   *
   *
   * @param {String} uid Authorization uid attached to the HTTP header
   * @return {users} Decoded jsonwebtoken
   * @throws {JwtMalformedException} Throws error when token is malformed or empty
   */

  /**
   * will Sign and validate JWT token
   *
   * */
  async jwtSign(uid: string): Promise<string> {
    const jwtAll = jwt.sign(
      {
        //will sign token for up to 24 hours
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        uid: uid,
      },
      config.app.secret
    );

    const found = await prisma.users.findFirst({
      where: {
        uid: uid,
      },
    });
    if (found === null) {
      // will create a row inside the database if user id is not found
      const check = await prisma.users.create({
        data: {
          uid: uid,
          token: jwtAll,
        },
      });
    } else {
      // will update JWT token if user id is found
      const check = await prisma.users.update({
        where: {
          uid: uid,
        },
        data: {
          token: jwtAll,
        },
      });
    }

    return jwtAll;
  },

  /**
   * Implement ldap system for login to the salisbury university ldap
   *
   * */
  async ldapJs(uid: string, pass: string): Promise<string> {
    // return this.jwtSign(uid);
    //creates connection with henson LDAPJS system
    const client = ldapjs.createClient({
      url: config.app.ldap,
    });

    client.on("error", (err) => {
      //console.log("test")
      // handle connection error
    });

    var user = "";

    await client.bind(
      config.app.dn,
      "uid=" + uid + "," + config.app.dn,
      pass,
      async (err) => {
        // check to see if user returns then JWT sign and put inside User table

        client.unbind();

        console.log(user);
        //Will sign the JSON webtoken if no error
        if (err == null) {
          console.log("pass");
          user = await this.jwtSign(uid);
        } else {
          user = err;
          console.log(err);
        }
      }
    );

    var check = await prisma.users.findUnique({
      where: {
        uid: uid,
      },
    });
    if (check === null || check.token == null) {
      throw new InvalidCredentialException();
    }

    return check.token;
  },

  async Logout(token: String): Promise<void> {
    if (token == "") {
      return;
    }

    try {
      // Verifiy token that returns decoded token
      const verified = this.verifyToken(token);

      // update users table setting token equal to empty string
      const updateUser = await prisma.users.update({
        where: {
          uid: verified.uid,
        },
        data: {
          token: "",
        },
      });
    } catch (e) {}
  },
};
