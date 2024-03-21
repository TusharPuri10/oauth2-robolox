import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

//0. get username
router.post("/signin", async(req: Request,res: Response)=>{
    const data = req.body;
    console.log(data);

    res.json({
        "sub": "12345678",
        "name": "Jane Doe",
        "nickname": "robloxjanedoe",
        "preferred_username": "robloxjanedoe",
        "created_at": 1607354232,
        "profile": "https://www.roblox.com/users/12345678/profile"
    })
    
});

export default router;