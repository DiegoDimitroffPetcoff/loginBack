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
      userCreated.save()


      //tengo que lograr enviar todo el usuario
      return done(null, userCreated);
    }
  })
);

passport.use(
  "login",
  new PassportLocal(async function (username, password, done) {
    let user = await UserModel.findOne({ username: username }, { username: 1 });
    let pass = await UserModel.findOne({ username: username }, { password: 1 });

    if (username == user.username && password == pass.password) {



      console.log("logeo correcto");




      return done(null, user);
    } else {
      console.log("EL USUARIO NOOOO EXSTE");
      console.log(user.username);
      console.log(password.password);
      return done(null, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
  console.log("id............................");
 let result = await UserModel.findById(id)
 console.log(result)





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
          res.send("Algo salio mal en el logeo");
        });

                //ruta de EXITO
                route.get("/loginsuccess", (req, res) => {
                  res.send("LOGEADO CORRETAMENTE");
                });

    //REGISTRO get
    route.get("/signout", (req, res) => {
      res.send("REGISTRARSE. METODO POST");
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
    route.get(
      "/test",
      (req, res, next) => {
        if (req.isAuthenticated()) return next(), res.send("NO LOGEADO");
      },
      (req, res) => {
        res.send("ESTA LOGEADO");
      }
    );







    return route;
  }
};
