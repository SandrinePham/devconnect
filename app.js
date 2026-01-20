const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const dontenv = require("dotenv");
const path = require("path");


dontenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(express.static('uploads'));
connectDB();
app.use("/api/projects", require("./routes/projects.routes"));
app.use("/api/users", require("./routes/users.routes"));

// like un projet
// commenter un projet (= création d'un commentaire)
// supprimer un projet
// modifier un projet

// inscription
// connexion

app.listen(5500, () => console.log("Server running"));
