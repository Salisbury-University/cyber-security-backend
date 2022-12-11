/**
 * Application related configuration
 */
export default {
  /** 
	The port the web server listens on for connections.
	*/
  port: process.env.PORT ? process.env.PORT : 3000,
  ldap: process.env.LDAP ? process.env.LDAP : "IDK",
  url: process.env.URL ? process.env.URL : "",
  token: "PVEAPIToken=" + process.env.TICKET_ID + "=" + process.env.TICKET_UUID,
  novnc:
    "PVEAPIToken=" +
    process.env.NOVNC_TICKET_ID +
    "=" +
    process.env.NOVNC_TICKET_UUID,
  novncUser: process.env.NOVNC_USERNAME,
  novncPass: process.env.NOVNC_PASSWORD,
};
