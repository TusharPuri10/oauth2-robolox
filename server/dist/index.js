"use strict";
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
// Generating a new secret at runtime invalidates existing cookies if the server restarts.
// Set your own constant cookie secret if you want to keep them alive despite server restarting.
const cookieSecret = process.env.COOKIE_SECRET || openid_client_1.generators.random();
// Middleware to simplify interacting with cookies
app.use((0, cookie_parser_1.default)(cookieSecret));
// Middleware to parse data from HTML forms
app.use(express_1.default.urlencoded({ extended: true }));
// Middlwware allows request from everywhere (not for production ready backend, just for testing)
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
// Middleware to parse JSON-formatted data in incoming requests
app.use(body_parser_1.default.json());
// route to return user credentials
app.use('/user', auth_1.default, getuser_1.default);
// default route for testing
app.get("/", (req, res) => {
    res.send("Hello, this is the default!");
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
//All route handlers
module.exports = app;
