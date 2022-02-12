const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const config = require("./config/config.js");

mongoose.connect(`mongodb://${config.user}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${config.database}?directConnection=true&ssl=false`);

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/", require("./routes/redirect.js"));

app.get("/", (req, res) => res.status(302).redirect(config.default));

app.listen(80, () => console.log("URL Shortener is online"));