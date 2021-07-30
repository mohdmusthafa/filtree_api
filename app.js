//Dependencies
const express = require('express');

//File dependencies
const routes = require('./src/routes');
const DB = require('./src/db-config');

//Static declarations
const app = express();
const PORT = process.env.PORT || 3000;

//DB
DB.sequelize.authenticate().then(() => console.log('DB Connected!!'))
DB.sequelize.sync()

//Middlewares
app.use(express.json())
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})