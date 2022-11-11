/**
 * Application related configuration
 */
export default {
  /**
	The port the web server listens on for connections.
	*/
  port: process.env.PORT ? process.env.PORT : 3000,
  ldap: process.env.LDAP ? process.env.LDAP : "",
  suNodes1: process.env.nodes
    ? process.env.nodes.split("[")[1].split("]")[0].split[","]
    : [],
  nodeUrl: process.env.NODEURL ? process.env.NODEURL : "",
  token: "PVEAPIToken=".concat(
    process.env.TICKETID,
    "=",
    process.env.TICKETUUID
  ),
};
