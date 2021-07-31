const DB = require('../db-config');

exports.getUserByUsername = async (username) => {
    try {
        return await DB.Users.findOne({
            where: {
                username
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

exports.getUserDataByUserId = async (user_id) => {
    try {
        return await DB.Users.findOne({
            where: { id: user_id },
            attributes: ['id', 'username']
        })
    } catch (err) {
        console.log(err)
    }
}

exports.addUser = async (username, hashedPassword) => {
    try {
        const info = {
            username,
            password: hashedPassword
        }

        return await DB.Users.create(info)
    } catch (err) {
        console.log(err)
    }
}