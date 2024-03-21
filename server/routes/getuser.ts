import { Router } from 'express';
import { Request, Response } from 'express';
import { TokenSet } from "openid-client";


const router = Router();

//get user information
router.get("/info", (req: Request,res: Response)=>{
    const tokenSet = new TokenSet(req.signedCookies.tokenSet);
    // response with user information from the token claims
    res.json(tokenSet.claims());
    
}); 

export default router;