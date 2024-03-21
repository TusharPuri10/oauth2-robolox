"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openid_client_1 = require("openid-client");
const cookie_1 = require("../utils/cookie");
async function checkLoggedIn(req, res, next) {
    if (req.signedCookies.tokenSet) {
        // User is logged in. Refresh tokens if expired
        let tokenSet = new openid_client_1.TokenSet(req.signedCookies.tokenSet);
        if (tokenSet.expired()) {
            tokenSet = await client.refresh(tokenSet);
            res.cookie("tokenSet", tokenSet, cookie_1.secureCookieConfig);
        }
        next();
    }
    else {
        // User is not logged in. Redirect to login page.
        res.redirect("/login");
    }
}
