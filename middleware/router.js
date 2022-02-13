const { Router } = require("express");
const { readdir } = require("fs/promises");
const Logger = require("./logger");
const config = require("../config/config.js");
const urlData = require('../models/url.js');
const router = Router();

router.Logger = new Logger();

router.get("/:code", async (req, res) => {
    if(req.params.code === "shorten") return req.next();
    const url = await urlData.findOne({ code: req.params.code }).catch(e => {});

    return res.status(302).redirect(url?.long || config.default);
})

/*router.get("/", async (req, res) => {
    if(req.params.code === "shorten") return req.next();

    return res.status(302).redirect(config.default);
})*/

readdir("routes/").then(files => {
    files.forEach(file => {
        if(!file.endsWith(".js")) return;
        let fileName = file.replace(".js","");
        let route = require("../routes/"+file);
        console.log(fileName);
        router.get(`/${fileName}${route.params || ""}`, route.get);
        if(route.post) router.post(`/${fileName}${route.params || ""}`, route.post)
        //console.log(`${fileName}${route.params || ""}`);
    });
});

module.exports = router;