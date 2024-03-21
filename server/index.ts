import express from "express";
import bodyParser from "body-parser";
const port = 3000;
import cors from "cors";
import authenticationRouter from './routes/authentication';
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, this is the default!");
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
); //backend allows request from everywhere (not for production ready backend, just for testing)

app.use(bodyParser.json());
app.use('/authentication', authenticationRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

//All route handlers

module.exports = app;
