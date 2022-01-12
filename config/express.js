require('dotenv').config({ path: 'ENV_FILENAME' });
const express = require('express');
const routes = require('./routes/index-routes');
const chalk = require('chalk');
var logger = require("morgan");
var cors = require("cors");
var path = require("path");
const AppError = require('../utils/appError');
const ErrorHandler = require('../api/controllers/errorController')
const mongoose = require('mongoose');
const upload = require("express-fileupload");
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log(chalk.black.bgYellow.bold(`Connected To MongoDB ${process.env.DATABASE}.. `),);
    }
);

app.use(express.json());
app.use(cors());
app.use(upload());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.all("*", (req, res, next) => {
    throw new AppError(`Requested Url ${req.path} Not Found !`, 404);
});


app.use(ErrorHandler)

module.exports = app;