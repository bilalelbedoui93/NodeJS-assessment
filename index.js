require("dotenv").config();

const express = require("express");
const app = express();
const routes = require('./routes')

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");


const { env: { MONGO_URL, PORT } } = process;

(async () => {
    try {
        await mongoose.connect(MONGO_URL || "mongodb://localhost/pokemon-db", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        app.use(bodyParser.json());
        app.use(cors())

        app.use('/api', routes)

        console.log(`connected to database MongoDB! Port:${MONGO_URL}`);

        const port = process.env.PORT || 8000
        
        app.listen(port, () => console.log(`listening to the port ${port}...`))

    } catch (error) {
        console.log('Cannot connect to the db')
    }
})()