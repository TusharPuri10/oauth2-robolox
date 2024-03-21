"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openid_client_1 = require("openid-client");
const router = (0, express_1.Router)();
//get user information
router.get("/info", (req, res) => {
    const tokenSet = new openid_client_1.TokenSet(req.signedCookies.tokenSet);
    // response with user information from the token claims
    res.json(tokenSet.claims());
});
exports.default = router;
