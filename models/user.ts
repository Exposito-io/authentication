import { ObjectID } from 'mongodb'


class User {

    _id: String|ObjectID

    constructor() {

    }

    static fromJSON(json: any): User {
        let user = new User()
        return Object.assign(user, json)
    }
}



export default User