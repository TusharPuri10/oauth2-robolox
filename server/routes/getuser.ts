import { Router } from "express";
import { Request, Response } from "express";
import { TokenSet, BaseClient } from "openid-client";
import { NextFunction } from "express";

// Initialize router
const router = Router();

// Define client variable to store client instance
let client: BaseClient;
let secureCookieConfig: {
  secure: boolean;
  httpOnly: boolean;
  signed: boolean;
};

// Middleware to set secureCookieConfig instance
export const setSecureCookieConfig = (secureCookieConfigInstance: {
  secure: boolean;
  httpOnly: boolean;
  signed: boolean;
}) => {
  secureCookieConfig = secureCookieConfigInstance;
};

// Middleware to ensure secureCookieConfig instance is set
export const ensureSecureCookieConfig = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!secureCookieConfig) {
    console.error("Error: secureCookieConfig instance not set");
    return res
      .status(500)
      .json({ error: "secureCookieConfig instance not set" });
  }
  next();
};

// Middleware to set client instance
export const setClient = (clientInstance: BaseClient) => {
  client = clientInstance;
};

// Middleware to ensure client instance is set
export const ensureClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!client) {
    console.error("Error: Client instance not set");
    return res.status(500).json({ error: "Client instance not set" });
  }
  next();
};

// Route to get user information
router.get(
  "/info",
  ensureClient,
  ensureSecureCookieConfig,
  (req: Request, res: Response) => {
    const tokenSet = new TokenSet(req.signedCookies.tokenSet);
    // Response with user information from the token claims
    const userinfo = tokenSet.claims();
    res.json({
      redirectToAuth: false,
      userinfo,
    });
  }
);

// Route for logout
router.get(
  "/logout",
  ensureClient,
  ensureSecureCookieConfig,
  (req: Request, res: Response) => {
    // Revoke the session tokens if available
    if (req.signedCookies.tokenSet) {
      client.revoke(req.signedCookies.tokenSet.refresh_token);
    }

    // Clear cookies and redirect back to index (which will lead back to login)
    res.clearCookie("tokenSet").redirect("/");
  }
);

export default router;
