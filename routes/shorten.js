const { Request, Response } = require("express");
const { generate } = require("shortid");
const url = require("../models/url");

/**
 * GET Method
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.get = async (req, res) => {
    if(!req.isAuthenticated() || !req.user) return res.redirect("/callback")

    return res.render("shorten", {
        code: null
    });
}

module.exports.post = async (req, res) => {
    if(!req.isAuthenticated() || !req.user) {
        req.session.backURL = "/shorten"
        return res.redirect("/callback")
    }

    let domain = req.body?.domain;
    let code = req.body?.code || generate();

    urlData = new url({
        code: code,
        long: domain
    })
    await urlData.save()

    return res.render("shorten", {
        code
    })
}