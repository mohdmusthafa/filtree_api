const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserQueries = require('./queries/users');
const NumbersQueries = require('./queries/numbers');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: 18000 })
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        req.user = user

        next()
    })
}

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await UserQueries.getUserByUsername(username);
        
        if(user === null){
            return res.sendStatus(401)
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(401).json({ message: "Username or Password wrong"});
        }

        const token = generateAccessToken({ id: user.id });
        res.json({
            accessToken: token
        })
    } catch (err) {
        next(err)
    }
})

router.post('/sign_up', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserQueries.addUser(username, hashedPassword);
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
    }
})

router.get('/authenticated', authenticate, async (req, res) => {
    try {
        const result = await UserQueries.getUserDataByUserId(req.user.id)
        res.json(result);
    } catch (err) {
        console.log(err)
    }
})

router.post('/insert', authenticate, async (req, res, next) => {
    try {
        const { number, times } = req.body;
        await NumbersQueries.insertNumberEntry(number, times, req.user.id)
        res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.get('/list', authenticate, async (req, res, next) => {
    try {
        const result = await NumbersQueries.getEntriesByUserId(req.user.id);
        res.json(result);
    } catch (err) {
        next(err)
    }
})

router.post('/filter', authenticate, async (req, res, next) => {
    try {
        const { filter, condition } = req.body;
        const result = await NumbersQueries.getEntriesWithFilter(filter, condition, req.user.id);
        res.json(result);
    } catch (err) {
        next(err)
    }
})

router.post('/summary', authenticate, async (req, res, next) => {
    try {
        const PRICE_PER_TIME = 10;
        const { filter } = req.body;
        const valueCounts = await NumbersQueries.getSummaryForFilter(filter, req.user.id);
        const result = {
            ...valueCounts,
            in_amount: valueCounts.in_value * PRICE_PER_TIME,
            out_amount: valueCounts.out_value * PRICE_PER_TIME,
        }
        res.json(result)
    } catch (err) {
        next(err)
    }
})

router.delete('/flush', authenticate, async (req, res, next) => {
    try {
        await UserQueries.flushUserData(req.user.id)
        res.sendStatus(200)
    } catch (err) {
        next(err)
    }
})

module.exports = router;