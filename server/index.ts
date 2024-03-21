import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
const port = 3000;
import cors from "cors";
import getUser from "./routes/getuser";
import { generators } from "openid-client";
import cookieParser from "cookie-parser";
import checkLoggedIn from "./middleware/auth";
const app = express();
import { BaseClient } from "openid-client";
import { NextFunction } from "express";

// Generating a new secret at runtime invalidates existing cookies if the server restarts.
// Set your own constant cookie secret if you want to keep them alive despite server restarting.
const cookieSecret = process.env.COOKIE_SECRET || generators.random();

// Define closure variables to store client and secureCookieConfig
let callbackClient: any;
let callbackSecureCookieConfig: any;

// Middleware to simplify interacting with cookies
app.use(cookieParser(cookieSecret));

// Middleware to parse data from HTML forms
app.use(express.urlencoded({ extended: true }));

// Middlwware allows request from everywhere (not for production ready backend, just for testing)
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware to parse JSON-formatted data in incoming requests
app.use(bodyParser.json());

// Define a callback function to handle client and secureCookieConfig
function handleLoggedIn(
  client: BaseClient,
  secureCookieConfig: {
    secure: boolean;
    httpOnly: boolean;
    signed: boolean;
  }
) {
  callbackClient = client;
  callbackSecureCookieConfig = secureCookieConfig;
}

// route to return user credentials
app.use(
  "/user",
  (req: Request, res: Response, next: NextFunction) => {
    checkLoggedIn(req, res, next, handleLoggedIn);
  },
  getUser
);

// Define the /oauth/callback route
app.get("/oauth/callback", async (req: Request, res: Response) => {
  try {
    // Ensure client and secureCookieConfig are available
    if (!callbackClient || !callbackSecureCookieConfig) {
      throw new Error("Client or secureCookieConfig not available");
    }

    const params = callbackClient.callbackParams(req);
    const tokenSet = await callbackClient.callback(
      `http://localhost:${port}/oauth/callback`,
      params,
      {
        state: req.signedCookies.state,
        nonce: req.signedCookies.nonce,
      }
    );

    // Store user details in the userData and session tokens in their respective cookies
    res
      .cookie("tokenSet", tokenSet, callbackSecureCookieConfig)
      .clearCookie("state")
      .clearCookie("nonce")
      .redirect("/home");
  } catch (error) {
    console.error("Error in /oauth/callback route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post(
  "/message",
  (req: Request, res: Response, next: NextFunction) => {
    checkLoggedIn(req, res, next, handleLoggedIn);
  },
  async (req: Request, res: Response) => {
    try {
      // Ensure callbackClient is set before handling the route
      if (!callbackClient) {
        return res
          .status(500)
          .json({ error: "Callback client instance not set" });
      }

      const message = req.body.message;
      const apiUrl = `https://apis.roblox.com/messaging-service/v1/universes/${req.body.universeId}/topics/${req.body.topic}`;

      // Send the message using the access token for authorization
      const result = await callbackClient.requestResource(
        apiUrl,
        req.signedCookies.tokenSet.access_token,
        {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result);
      res.sendStatus(result.statusCode);
    } catch (error) {
      console.error("Error in /message route:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// default route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is the default!");
});

// listening on port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
