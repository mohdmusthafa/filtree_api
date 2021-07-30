const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Numbers = sequelize.define('Numbers', {
        number: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        times: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        tableName: 'numbers',
        timestamps: false
    })

    return Numbers
}