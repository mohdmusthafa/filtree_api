const DB = require('../db-config');

exports.getUserByUsernameAndPassword = async (username, password) => {
    try {
        return await DB.Users.findOne({
            where: {
                username,
                password
            },
            raw: true
        })
    } catch (err) {
        console.log(err)
    }
}

exports.flushUserData = async (user_id) => {
    try {
        return await DB.Numbers.destroy({
            where: { created_by: user_id }
        })
    } catch (err) {
        console.log(err)
    }
}