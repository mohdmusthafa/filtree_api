const { Sequelize } = require('sequelize');

const CONFIG = {
    hostname: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 8888,
    username: process.env.DB_USERNAME || 'musthu',
    password: process.env.DB_PASSWORD || 'password',
    dbname: process.env.DB_NAME || 'filtree'
}

const sequelize = new Sequelize(CONFIG.dbname, CONFIG.username, CONFIG.password, {
    host: CONFIG.hostname,
    port: CONFIG.port,
    dialect: 'mysql'
})


//Models
const Numbers = require('../src/models/numbers')(sequelize, Sequelize);
const Users = require('../src/models/users')(sequelize, Sequelize);
Users.hasMany(Numbers)

const DB = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Numbers,
    Users
}

module.exports = DB;