import BaseException from "./BaseException";

export default class UserDuplicateException extends BaseException{
    constructor(msg: string = " User Duplication"){
        super(msg, 422)
    }
}