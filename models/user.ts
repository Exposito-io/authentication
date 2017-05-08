

class User {

    constructor() {

    }

    static fromJSON(json: any) : User {
        let user = new User()
        return Object.assign(user, json)
    }
}



export default User