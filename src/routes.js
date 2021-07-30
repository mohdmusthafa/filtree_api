const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserQueries = require('./queries/users');
const NumbersQueries = require('./queries/numbers');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, 'secret', { expiresIn: 18000 })
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        req.user = user

        next()
    })
}

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserQueries.getUserByUsernameAndPassword(username, password);
        
        if(user === null){
            res.sendStatus(401)
        }
        const token = generateAccessToken({ id: user.id });
        res.json({
            accessToken: token
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/insert', authenticate, async (req, res) => {
    try {
        const { number, times } = req.body;
        await NumbersQueries.insertNumberEntry(number, times, req.user.id)
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
    }
})

router.get('/list', authenticate, async (req, res) => {
    try {
        const result = await NumbersQueries.getEntriesByUserId(req.user.id);
        res.json(result);
    } catch (err) {
        console.log(err)
    }
})

router.post('/filter', authenticate, async (req, res) => {
    try {
        const { filter, condition } = req.body;
        const result = await NumbersQueries.getEntriesWithFilter(filter, condition, req.user.id);
        res.json(result);
    } catch (err) {
        console.log(err)
    }
})

router.post('/summary', authenticate, async (req, res) => {
    try {
        const PRICE_PER_TIME = 10;
        const { filter } = req.body;
        const valueCounts = await NumbersQueries.getSummaryForFilter(filter, req.user.id);
        const result = {
            ...valueCounts,
            in_amount: valueCounts.in_values * PRICE_PER_TIME,
            out_amount: valueCounts.out_values * PRICE_PER_TIME,
        }
        res.json(result)
    } catch (err) {
        console.log(err);
    }
})

router.delete('/flush', authenticate, async (req, res) => {
    try {
        await UserQueries.flushUserData(req.user.id)
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;