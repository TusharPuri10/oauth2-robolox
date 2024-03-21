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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openid_client_1 = require("openid-client");
const openid_1 = __importDefault(require("../utils/openid"));
const getuser_1 = require("../routes/getuser");
function checkLoggedIn(req, res, next, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, secureCookieConfig } = yield (0, openid_1.default)();
        callback(client, secureCookieConfig);
        (0, getuser_1.setClient)(client);
        secureCookieConfig;
        if (req.signedCookies.tokenSet) {
            // User is logged in. Refresh tokens if expired
            let tokenSet = new openid_client_1.TokenSet(req.signedCookies.tokenSet);
            if (tokenSet.expired()) {
                tokenSet = yield client.refresh(tokenSet);
                res.cookie("tokenSet", tokenSet, secureCookieConfig);
            }
            next();
        }
        else {
            // User is not logged in.
            const state = openid_client_1.generators.state();
            const nonce = openid_client_1.generators.nonce();
            res
                .cookie("state", state, secureCookieConfig)
                .cookie("nonce", nonce, secureCookieConfig)
                .redirect(client.authorizationUrl({
                state,
                nonce,
            }));
        }
    });
}
exports.default = checkLoggedIn;
