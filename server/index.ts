import express from "express";
import { Request, Response } from 'express';
import bodyParser from "body-parser";
const port = 3000;
import cors from "cors";
import getUser from './routes/getuser';
import { generators } from "openid-client";
import cookieParser from "cookie-parser";
import checkLoggedIn from "./middleware/auth";
const app = express();

// Generating a new secret at runtime invalidates existing cookies if the server restarts.
// Set your own constant cookie secret if you want to keep them alive despite server restarting.
const cookieSecret = process.env.COOKIE_SECRET || generators.random();

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

// route to return user credentials
app.use('/user', checkLoggedIn, getUser);

// default route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is the default!");
});



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

//All route handlers

module.exports = app;
