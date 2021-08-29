const Connection = require('./mongoDB.js')
const RD = require('reallydangerous');
require('dotenv').config()
const signer = new RD.Signer(process.env.SECRET, process.env.SALT);
let permissions = [];

const checkPermissions = async (token) => {
    const username = signer.unsign(token);

    if (permissions.includes(username)) return permissions.username;
    const type = (await Connection.collections.users.findOne({ username: username }, { projection: { type: 1, _id: 0 } }));
    if (type == null) return false;
    else {
        permissions[username] = type.type;
        return {type: type.type, username: username};
    }
}

const setPermissions = async(username, perms) => {
    permissions[username] = perms
}

const deletePermissions = async(username) => {
    delete permissions[username]
}

module.exports = {checkPermissions, setPermissions, deletePermissions}