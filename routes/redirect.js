const express = require('express');
const config = require("../config/config.js");
const urlData = require('../models/url.js');

const router = express.Router();

router.get('/:code', async (req, res) => {
    const url = await urlData.findOne({ code: req.params.code }).catch(e => {});

    return res.status(302).redirect(url?.long || config.default);
});


module.exports = router;