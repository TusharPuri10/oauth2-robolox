import {Request ,Response ,NextFunction} from 'express';
import { TokenSet, generators } from "openid-client";
import setupOpenID from '../utils/openid';

async function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
    const { client, secureCookieConfig } = await setupOpenID();
    const state = generators.state();
    const nonce = generators.nonce();
    if (req.signedCookies.tokenSet) {
        // User is logged in. Refresh tokens if expired
        let tokenSet = new TokenSet(req.signedCookies.tokenSet);

        if (tokenSet.expired()) {
            tokenSet = await client.refresh(tokenSet);
            res.cookie("tokenSet", tokenSet, secureCookieConfig);
        }

        next();
    } else {
        // User is not logged in. Redirect to login page.
        res
        .cookie("state", state, secureCookieConfig)
        .cookie("nonce", nonce, secureCookieConfig)
        .redirect(
            `/login${client.authorizationUrl({
                state,
                nonce,
            })}`
        );
    }
}

export default checkLoggedIn;