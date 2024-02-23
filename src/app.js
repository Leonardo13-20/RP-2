//requerimos express
const express = require("express");
const session = require("express-session");
const path = require("path");
const morgan = require("morgan");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const app = express();
const port = process.env.PORT || 3000;

//importando rutas

const coustomerRouters = require("./routes/coustomer");

//ajustes servidor
app.set("port", process.env.PORT || port);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ajustes middlewares

app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);

app.use(morgan("dev"));
app.use(
  myConnection(
    mysql,
    {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306,
      database: "repo_password",
    },
    "single"
  )
);
app.use(express.urlencoded({ extended: false }));
//rutas del navegador

app.use("/", coustomerRouters);

//archivos estaticos

app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    "Content-Type": "application/javascript",
  })
);

app.listen(app.get("port"), () => {
  console.log("Servidor en el puerto ", app.get("port"));
});
