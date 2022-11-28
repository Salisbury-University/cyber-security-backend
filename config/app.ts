/**
 * Application related configuration
 */
export default {
  /**
	The port the web server listens on for connections.
	*/
  port: process.env.PORT ? process.env.PORT : 3000,
  ldap: process.env.LDAP ? process.env.LDAP : "",
  secret: process.env.SECRET ? process.env.SECRET : "",
  dn: process.env.DN ? process.env.DN : "",
  /**
   * Assuming that the nodes from the environment will be array,
   * This will allow the cluster to be scalable
   */
  anton: [process.env.CHEEZE, process.env.WATER, process.env.GATORADE],
  nodeUrl: process.env.NODEURL ? process.env.NODEURL : "",
  token: "PVEAPIToken=".concat(
    process.env.TICKETID,
    "=",
    process.env.TICKETUUID
  ),
};
