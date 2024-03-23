import { Request, Response, NextFunction } from "express";
import { TokenSet, generators } from "openid-client";
import setupOpenID from "../utils/openid";
import { BaseClient } from "openid-client";
import { setClient, setSecureCookieConfig } from "../routes/getuser";

async function checkLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
  callback: (
    client: BaseClient,
    secureCookieConfig: {
      secure: boolean;
      httpOnly: boolean;
      signed: boolean;
    }
  ) => void
) {
  const { client, secureCookieConfig } = await setupOpenID();
  callback(client, secureCookieConfig);
  setClient(client);
  setSecureCookieConfig(secureCookieConfig);

  if (req.signedCookies.tokenSet) {
    // User is logged in. Refresh tokens if expired
    let tokenSet = new TokenSet(req.signedCookies.tokenSet);

    if (tokenSet.expired()) {
      tokenSet = await client.refresh(tokenSet);
      res.cookie("tokenSet", tokenSet, secureCookieConfig);
    }

    next();
  } else {
    // User is not logged in.
    const state = generators.state();
    const nonce = generators.nonce();

    // Redirect the authorization URL to frontend
      res.json({
        redirectToAuth: true,
        authorizationUrl: client.authorizationUrl({
          scope: client.scope as string,
          state,
          nonce,
        }),
      });
  }
}

export default checkLoggedIn;
