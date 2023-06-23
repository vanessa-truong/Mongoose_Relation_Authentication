import express from "express";
import dotenv from "dotenv";

import { User } from "./model/index.js";
import { generateAccessToken, authenticateToken } from "./lib/jwt.js";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const PORT = process.env.BE_PORT || 3000;
const app = express();

// const ReactAppDistPath = require("path").join(__dirname, "../front-end/dist/");
const ReactAppDistPath = new URL("../front-end/dist/", import.meta.url);
const ReactAppIndex = new URL("../front-end/dist/index.html", import.meta.url);

// Parse req.body (json string) zu einem js Object
app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(ReactAppDistPath.pathname));

app.use(express.static(ReactAppDistPath.pathname));
/*
 * express.static match auf jede Datei im angegebenen Ordner
 * und erstellt uns einen request handler for FREE
 * app.get("/",(req,res)=> res.sendFile("path/to/index.html"))
 * app.get("/index.html",(req,res)=> res.sendFile("path/to/index.html"))
 */

app.get("/api/status", (req, res) => {
  res.send({ status: "Ok" });
});

app.post("/api/signup", async (req, res) => {
  // neuen User erstellen
  const { name, email } = req.body;
  // console.log(req.body);
  const newUser = new User({ name, email });
  // user.setPasswort hash und salt setzen
  // wieso setPasswort hier verwenden ohne useState? weshalb geht das?
  newUser.setPassword(req.body.password);
  // user speichern
  try {
    await newUser.save();
    return res.send({
      data: {
        message: "new User created",
        user: { name, email },
      },
    });
  } catch (e) {
    console.error(e);
    if (e.name === "validationError") {
      return res.status(400).send({ error: e });
    }

    // email exisitert bereits als User
    if (e.name === "MongoServerError" && e.code === 11000) {
      console.log("Redirect");
      return res.redirect("/login");
    }

    return res
      .status(500)
      .send({ error: { message: "Unknown server error! " } });
  }
});

app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  //finde User mit email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .send({ error: { message: "Email and Password combination is wrong!" } });
  }

  //vergleiche Password mit user.verify password
  const isVerified = user.verifyPassword(req.body.password);
  if (isVerified) {
    const token = generateAccessToken({ email });
    res.cookie("auth", token, { httpOnly: true, maxAge: 1000 * 60 * 30 });
    return res.send({ data: { token } });
  }

  res
    .status(401)
    .send({ error: { message: "Email and password combination wrong" } });
});

// app.get("/api/logout", (req, res) => {
//   res.clearCookie("auth");
//   res.send("OK");
// });

app.get("/api/verified", authenticateToken, (req, res) => {
  res.send(req.userEmail);
});

app.get("/*", (req, res) => {
  res.sendFile(ReactAppIndex.pathname);
});

app.listen(PORT, () => {
  console.log("Server running on Port: ", PORT);
});
