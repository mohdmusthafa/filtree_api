//Dependencies
const express = require('express');

//File dependencies
const routes = require('./src/routes');
const DB = require('./src/db-config');

//Static declarations
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

//DB
DB.sequelize.authenticate().then(() => console.log('DB Connected!!'))
DB.sequelize.sync()

//Middlewares
app.use(express.json())
app.use("/api", routes);
app.use((err, req, res, next) => {
    const errorPayload = {
        message: err.toString()
    }
    res.status(500).json(errorPayload)
})
app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`)