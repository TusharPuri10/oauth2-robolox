"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
//0. get username
router.post("/signin", async (req, res) => {
    const data = req.body;
    console.log(data);
    res.json({
        "sub": "12345678",
        "name": "Jane Doe",
        "nickname": "robloxjanedoe",
        "preferred_username": "robloxjanedoe",
        "created_at": 1607354232,
        "profile": "https://www.roblox.com/users/12345678/profile"
    });
});
exports.default = router;
