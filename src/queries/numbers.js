const { Op } = require('sequelize');
const DB = require('../db-config');

exports.insertNumberEntry = async (number, times, created_by) => {
    try {
        const info = {
            number,
            times,
            created_by
        }

        await DB.Numbers.create(info)
        return
    } catch (err) {
        console.log(err)
    }
}

exports.getEntriesByUserId = async (user_id) => {
    try {
        return await DB.Numbers.findAll({
            where: { created_by: user_id },
            order: [['id', 'desc']],
            raw: true
        })
    } catch (err) {
        console.log(err)
    }
}

exports.getEntriesWithFilter = async (filter, condition, user_id) => {
    try {
        const filterCondition = condition === 'gt' ? Op.gt : Op.lt
        return await DB.Numbers.findAll({
            where: {
                times: { [filterCondition]: filter },
                created_by: user_id
            },
            order: [['id', 'desc']],
            raw: true
        })
    } catch (err) {
        console.log(err)
    }
}

exports.getSummaryForFilter = async (filter, user_id) => {
    try {
        const in_values = await DB.Numbers.count({
            where: {
                times: { [Op.lt]: filter }
            }
        })
        const out_values = await DB.Numbers.count({
            where: {
                times: { [Op.gt]: filter }
            }
        })

        return {
            in_values,
            out_values
        }
    } catch (err) {
        console.log(err)
    }
}