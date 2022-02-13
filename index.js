const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const url = require("url");
const path = require("path");
const Strategy = require("passport-discord").Strategy;
const passport = require("passport");
const util = require("util");

const config = require("./config/config")

const app = express();
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const router = require("./middleware/router.js");

mongoose.connect(`mongodb://${config.user}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${config.database}?directConnection=true&ssl=false`);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj))
passport.use(new Strategy({
    clientID: config.applicationID,
    clientSecret: config.secret,
    callbackURL: config.callback,
    scope: ["identify"]
},
(accessToken, refreshToken, profile, done) => {
    process.nextTick(()=>done(null, profile))
}
))

app.use(session({
    store: new MemoryStore({checkPeriod: 86400000 }),
    secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "*"
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/login", (req, res, next) => {
    if(req.session.backURL){
        req.session.backURL = req.session.backURL
    } else if(req.headers.referer){
        const parsed = url.parse(req.headers.referer);
        if(parsed.hostname == app.locals.domain){
            req.session.backURL = parsed.path
        }
    } else {
        req.session.backURL = "/"
    }
    next();
}, passport.authenticate("discord", { prompt: "none"})
);

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
    if(!req?.user || !req.user?.id || !req.user?.discriminator || !req.user?.avatar) {
        req.session.destroy()
        res.json({login: false, message: "Couldn't fetch ur Data", logout: true})
        return req.logout();
    };

    if(req?.user?.id != "552530299423293441") {
        req.session.destroy()
        res.json({login:false, message: "You are not allowed to use this site.", logout: true })
    }

    return res.redirect("/shorten")
});

app.set("view engine", "ejs")

app.use("/", router)

app.listen(80, () => console.log("URL Shortener is online"));