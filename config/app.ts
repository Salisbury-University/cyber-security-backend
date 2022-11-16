/**
 * Application related configuration
 */
export default {
  /**
	The port the web server listens on for connections.
	*/
  port: process.env.PORT ? process.env.PORT : 3000,
  ldap: process.env.LDAP ? process.env.LDAP : "",
  /**
   * Assuming that the nodes from the environment will be array,
   * This will allow the cluster to be scalable
   */
  anton: process.env.nodes
    ? process.env.nodes.split("[")[1].split("]")[0].split[","]
    : [],
  nodeUrl: process.env.NODEURL ? process.env.NODEURL : "",
  token: "PVEAPIToken=".concat(
    process.env.TICKETID,
    "=",
    process.env.TICKETUUID
  ),
};
