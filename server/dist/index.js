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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 3000;
const cors_1 = __importDefault(require("cors"));
const getuser_1 = __importDefault(require("./routes/getuser"));
const openid_client_1 = require("openid-client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./middleware/auth"));
const app = (0, express_1.default)();
// Middlwware allows request from everywhere (not for production ready backend, just for testing)
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Generating a new secret at runtime invalidates existing cookies if the server restarts.
// Set your own constant cookie secret if you want to keep them alive despite server restarting.
const cookieSecret = process.env.COOKIE_SECRET || openid_client_1.generators.random();
// Define closure variables to store client and secureCookieConfig
let callbackClient;
let callbackSecureCookieConfig;
// Middleware to simplify interacting with cookies
app.use((0, cookie_parser_1.default)(cookieSecret));
// Middleware to parse data from HTML forms
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware to parse JSON-formatted data in incoming requests
app.use(body_parser_1.default.json());
// Define a callback function to handle client and secureCookieConfig
function handleLoggedIn(client, secureCookieConfig) {
    callbackClient = client;
    callbackSecureCookieConfig = secureCookieConfig;
}
// route to return user credentials
app.use("/user", (req, res, next) => {
    (0, auth_1.default)(req, res, next, handleLoggedIn);
}, getuser_1.default);
// function parseCookies(cookieString: string): Record<string, string> {
//   const cookies: Record<string, string> = {};
//   cookieString.split(';').forEach(cookie => {
//     const [key, value] = cookie.trim().split('=');
//     cookies[key] = value;
//   });
//   return cookies;
// }
// Define the /oauth/callback route
app.get("/oauth/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure client and secureCookieConfig are available
        if (!callbackClient || !callbackSecureCookieConfig) {
            throw new Error("Client or secureCookieConfig not available");
        }
        // const cookieString = req.headers.cookie;
        // const cookies = parseCookies(cookieString!);
        // Retrieve state and nonce from signed cookies
        const state = req.signedCookies.state;
        const nonce = req.signedCookies.nonce;
        // Check if state is missing
        if (!state) {
            throw new Error("State cookie is missing");
        }
        const params = callbackClient.callbackParams(req);
        const tokenSet = yield callbackClient.callback(`http://localhost:${port}/oauth/callback`, params, {
            state: state,
            nonce: nonce,
        });
        // Store user details in the userData and session tokens in their respective cookies
        res
            .cookie("tokenSet", tokenSet, callbackSecureCookieConfig)
            .clearCookie("state")
            .clearCookie("nonce")
            .redirect("http://localhost:5173/");
    }
    catch (error) {
        console.error("Error in /oauth/callback route:", error);
        res.status(500).send("Internal Server Error");
    }
}));
// default route for testing
app.get("/", (req, res) => {
    res.send("Hello, this is the default!");
});
// listening on port
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
module.exports = app;
