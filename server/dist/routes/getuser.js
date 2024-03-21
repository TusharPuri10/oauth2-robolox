"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureClient = exports.setClient = exports.ensureSecureCookieConfig = exports.setSecureCookieConfig = void 0;
const express_1 = require("express");
const openid_client_1 = require("openid-client");
// Initialize router
const router = (0, express_1.Router)();
// Define client variable to store client instance
let client;
let secureCookieConfig;
// Middleware to set secureCookieConfig instance
const setSecureCookieConfig = (secureCookieConfigInstance) => {
    secureCookieConfig = secureCookieConfigInstance;
};
exports.setSecureCookieConfig = setSecureCookieConfig;
// Middleware to ensure secureCookieConfig instance is set
const ensureSecureCookieConfig = (req, res, next) => {
    if (!secureCookieConfig) {
        console.error('Error: secureCookieConfig instance not set');
        return res.status(500).json({ error: 'secureCookieConfig instance not set' });
    }
    next();
};
exports.ensureSecureCookieConfig = ensureSecureCookieConfig;
// Middleware to set client instance
const setClient = (clientInstance) => {
    client = clientInstance;
};
exports.setClient = setClient;
// Middleware to ensure client instance is set
const ensureClient = (req, res, next) => {
    if (!client) {
        console.error('Error: Client instance not set');
        return res.status(500).json({ error: 'Client instance not set' });
    }
    next();
};
exports.ensureClient = ensureClient;
// Route to get user information
router.get("/info", exports.ensureClient, exports.ensureSecureCookieConfig, (req, res) => {
    const tokenSet = new openid_client_1.TokenSet(req.signedCookies.tokenSet);
    // Response with user information from the token claims
    res.json(tokenSet.claims());
});
// Route for logout
router.get("/logout", exports.ensureClient, exports.ensureSecureCookieConfig, (req, res) => {
    // Revoke the session tokens if available
    if (req.signedCookies.tokenSet) {
        client.revoke(req.signedCookies.tokenSet.refresh_token);
    }
    // Clear cookies and redirect back to index (which will lead back to login)
    res.clearCookie("tokenSet").redirect("/");
});
exports.default = router;
