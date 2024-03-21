"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureCookieConfig = exports.cookieSecret = exports.client = exports.issuer = void 0;
const openid_client_1 = require("openid-client");
require("dotenv/config");
// Ingest the OpenID Connect configuration from the discovery document endpoint
exports.issuer = await openid_client_1.Issuer.discover("https://apis.roblox.com/oauth/.well-known/openid-configuration");
const clientId = process.env.ROBLOX_CLIENT_ID;
const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
exports.client = new exports.issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [`http://localhost:${port}/oauth/callback`],
    response_types: ["code"],
    scope: "openid profile",
    id_token_signed_response_alg: "ES256",
});
exports.cookieSecret = process.env.COOKIE_SECRET || openid_client_1.generators.random();
exports.secureCookieConfig = {
    secure: true,
    httpOnly: true,
    signed: true,
};
