import { ObjectId } from 'mongodb'
import * as config from 'config'
import * as dbFactory from 'mongo-factory'
import User from '../../models/user'


/**
 * User provider
 *
 */
class UserProvider {

    constructor() {

    }

    /**
     * Updates Google information for a specific user.
     * If the user doesn't exists, creates it.
     *
     * @param info
     */
    updateGoogleProfile(googleProfile) {

        return new Promise((resolve, reject) => {

            dbFactory.getConnection(config.database)
            .then(db => db.collection('users').find({ 'googleProfile.id': googleProfile.id }).limit(1).toArray())
            .then((users) => {
                if (users.length === 0) {
                    return this._createUserFromGoogleProfile(googleProfile)
                    .then(result => resolve(User.fromJSON(result.ops[0])))
                    .catch(err => reject(err));
                }
                else {
                    return this._updateGoogleProfile(users[0]._id, googleProfile)
                    .then(() => this.findById(users[0]._id))
                    .catch(err => reject(err));
                }
            })
            .catch(err => {
                let faew = 24;
                reject(err);
            });

        });
    }


    /**
     * Returns a user from his id
     *
     * @param  {string|ObjectId} id User ID
     * @return {Promise}
     */
    findById(id) {
        return new Promise((resolve, reject) => {
            if (!(id instanceof ObjectId))
                id = ObjectId(id);

            dbFactory.getConnection(config.database)
            .then(db => db.collection('users').find({ _id: id }).limit(1).toArray())
            .then(users => {
                if (users.length === 0)
                    throw("No user found");
                else
                    resolve(users[0])
            })
            .catch(err => reject(err));
        });
    }

    /**
     * Returns a user from his OAuth ID
     *
     * @param  {string} oauthId OAuth ID
     * @return {Promise}        
     */
    findByOauthId(oauthId) {
        return new Promise((resolve, reject) => {
            dbFactory.getConnection(config.database)
            .then(db => db.collection('users').find({ 'googleProfile.id': oauthId }).limit(1).toArray())
            .then(users => {
                if (users.length === 0)
                    throw("No user found");
                else
                    resolve(users[0])
            })
            .catch(err => reject(err));
        });
    }


    private _createUserFromGoogleProfile(googleProfile) {
        //googleProfile = this._extractOauthInfo(googleProfile);

        return dbFactory.getConnection(config.database)
               .then(db => db.collection('users').insertOne({googleProfile}))
    }

    private _updateGoogleProfile(_id, googleProfile) {
        //googleProfile = this._extractOauthInfo(googleProfile);

        return dbFactory.getConnection(config.database)
               .then(db => db.collection('users').updateOne({ _id }, { $set: {googleProfile} }))
    }


    private _extractOauthInfo(oauthInfo) {

        let info = {
            user_id: oauthInfo.user_id || oauthInfo.id,
            email: oauthInfo.email,
            email_verified: oauthInfo.verified_email || oauthInfo.email_verified
        };

        if (oauthInfo.name) info.name = oauthInfo.name;
        if (oauthInfo.picture) info.picture = oauthInfo.picture;
        if (oauthInfo.locale) info.locale = oauthInfo.locale;

        return info;
    }
}



export default UserProvider
