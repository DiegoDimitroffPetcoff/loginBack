const express = require("express");
const route = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const PassportLocal = require("passport-local").Strategy;
const validatePass = require("../src/utils/passValidatos");
const createHash = require("../src/utils/hashGenerator");
const UserModel = require("../src/models/users");

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

//confi cookieParser
route.use(cookieParser("secreto"));

//config session
route.use(
  session({
    secret: "diego",
    resave: true,
    saveUninitialized: true,
  })
);

//Inicializacion
route.use(passport.initialize());
route.use(passport.session());

//config de estrategia

passport.use(
  "signout",
  new PassportLocal(async function (username, password, done) {
    let user = await UserModel.findOne({ username: username }, { username: 1 });
    let pass = await UserModel.findOne({ username: username }, { password: 1 });
    console.log(user);
    if (user) {
      console.log("EL USUARIO YA EXISTE");
      return done(null, false);
    } else {
      console.log("SE HA CREADO EL USUARIO");

      const newUser = {
        username: username,
        password: password,
      };

      //TENGO QUE BUSCAR LA FORMA DE ENVIAR EL OBJETO CON EL ID

      const userCreated = new UserModel(newUser);
      userCreated.save();

      //tengo que lograr enviar todo el usuario
      return done(null, userCreated);
    }
  })
);

passport.use(
  "login",
  new PassportLocal(async function (username, password, done) {
    let user = await UserModel.findOne(
      { username: username },
      { username: 1, password: 1 }
    );

    //Primero corroboro que user no venga con un valor null, si llega con un valor null pasa directamente
    //al else. Si llega con un valor paso a compararlo con la DBS para retornar los valores
    if (user) {
      if (username === user.username && password === user.password) {
        console.log("logeo correcto");
        return done(null, user);
      } else {
        console.log("Username Or Password incorrect");
        return done(null, false);
      }
    } else {
      console.log("Username Or Password incorrect");
      return done(null, false);
    }
  })
);

//Passport va a serializar el usuario.. lo que yo mando desde la estrategia va a ir a parar a "user" en la siguiente funcion.
//luego lo va a deseralizar... a ese mismo valor que eligo enviar para volver a encontrarlo con mongo: en este caso busca al
//usuario deserializado mediante FindById()

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  let result = await UserModel.findById(id);
  done(null, result);
});

module.exports = class Routes {
  constructor() {}
  start() {
    //vista general
    route.get("/", (req, res) => {
      res.send(
        "Pagina principal... no se requiere estar logeado para ver esta pagina"
      );
    });

    //LOGIN get
    route.get("/login", (req, res) => {
      res.send("ACA DEBERIA ESTAR EL FORM PARA EL LOGEO");
    });

    //LOGIN post
    route.post(
      "/login",
      passport.authenticate("login", {
        successRedirect: "/loginsuccess",
        failureRedirect: "/loginfail",
      })
    );

    //ruta de fallo
    route.get("/loginfail", (req, res) => {
      res.send("Username Or Password incorrect");
    });

    //ruta de EXITO
    route.get("/loginsuccess", (req, res) => {
      res.send("Login success");
    });

    //REGISTRO get
    route.get("/signout", (req, res) => {
      res.send("Aca deberia estar la tabla de registro");
    });

    //REGISTRO post
    route.post(
      "/signout",
      passport.authenticate("signout", {
        successRedirect: "/signoutsuccess",
        failureRedirect: "/signoutfail",
      })
    );

    //ruta de fallo
    route.get("/signoutfail", (req, res) => {
      res.send("Algo salio mal en el registro");
    });

    //ruta de EXITO
    route.get("/signoutsuccess", (req, res) => {
      res.send("REGISTRO CORRECTO");
    });

    //CREAR RUTAS DE FAIL Y SUCCESS DE LOGIN Y SIGNOUT
    //PROBAR PRIMERO SIGNOUT

    //test
    //HACER RUTA TEST DE VUELTA

    

    return route;
  }
};
