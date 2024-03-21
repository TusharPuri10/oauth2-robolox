"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const openid_client_1 = require("openid-client");
require("dotenv/config");
function setupOpenID() {
    return __awaiter(this, void 0, void 0, function* () {
        const issuer = yield openid_client_1.Issuer.discover("https://apis.roblox.com/oauth/.well-known/openid-configuration");
        const port = process.env.ROBLOX_PORT || 3000;
        const clientId = process.env.ROBLOX_CLIENT_ID;
        const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
        const client = new issuer.Client({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uris: [`http://localhost:${port}/oauth/callback`],
            response_types: ["code"],
            scope: "profile",
            id_token_signed_response_alg: "ES256",
        });
        const secureCookieConfig = {
            secure: true,
            httpOnly: true,
            signed: true,
        };
        return { client, secureCookieConfig };
    });
}
exports.default = setupOpenID;
