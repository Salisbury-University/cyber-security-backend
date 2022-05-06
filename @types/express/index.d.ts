export {};
/**
 * {JSON} user: Holds the decoded jwtoken with user information
 */
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}