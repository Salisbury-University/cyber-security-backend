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
  node: process.env.URL ? process.env.URL : "move along",
  nodename: process.env.NODENAME ? process.env.NODENAME : "don't mind me",
  token: process.env.AUTHORIZATION ? process.env.AUTHORIZATION : "do not exist",
};
