/**
 * Application related configuration
 */
export default {
  /**
	The port the web server listens on for connections.
	*/
  port: process.env.PORT ? process.env.PORT : 3000,
  ticket_id: process.env.TICKET_ID ? process.env.TICKET_ID : "wrong",
  ticket_uuid: process.env.TICKET_UUID ? process.env.TICKET_UUID : "hahaha",
  node: process.env.NODE ? process.env.NODE : "move along",
  hostname: process.env.HOSTNAME ? process.env.HOSTNAME : "don't mind me",
};
