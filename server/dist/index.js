"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 3000;
const cors_1 = __importDefault(require("cors"));
const authentication_1 = __importDefault(require("./routes/authentication"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello, this is the default!");
});
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
})); //backend allows request from everywhere (not for production ready backend, just for testing)
app.use(body_parser_1.default.json());
app.use('/authentication', authentication_1.default);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
//All route handlers
module.exports = app;
