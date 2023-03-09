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
if(user){
  console.log("EL USUARIO YA EXISTE");
  return done(null, false);
} else {
  console.log("SE HA CREADO EL USUARIO")


    const newUser = {
      username: username,
      password: password,
    }
 
//TENGO QUE BUSCAR LA FORMA DE ENVIAR EL OBJETO CON EL ID
    await UserModel.create(newUser, (err, userWithId) => {
      console.log(userWithId)
      if (err) {
        console.log(`some issue happened: ${err}`);
        return done(err);
      }
    return done(null, userWithId);})

}

  })
);

passport.use(
  "login",
  new PassportLocal(async function (username, password, done) {
    let user = await UserModel.findOne({ username: username }, { username: 1 });
    let pass = await UserModel.findOne({ username: username }, { password: 1 });

    if (username == user.username && password == pass.password) {
      console.log("EL USUARIO ya existe  EXISTE");
      return done(null, false);
    } else {
      console.log("EL USUARIO NOOOO EXSTE");
      return done(null, false);
    }
  })
);

passport.serializeUser( (user, done) => {
  
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {

  await UserModel.findById(id,done)

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

    //login get
    route.get("/login", (req, res) => {
      res.send("ACA DEBERIA ESTAR EL FORM PARA EL LOGEO");
    });

    //login post
    route.post(
      "/login",
      passport.authenticate("login", {
        successRedirect: "/test2",
        failureRedirect: "/fail",
      })
    );

    //Registrarse post
    route.post(
      "/signout",
      passport.authenticate("signout", {
        successRedirect: "/test2",
        failureRedirect: "/fail",
      })
    );

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

    //test2
    route.get("/test2", (req, res) => {
      if (req.isAuthenticated()) {
        res.send("ESTA LOGEADO (test2)");
      } else res.send("NO LOGEADO (test2)");
    });

    //test3
    route.get("/test3", async (req, res) => {
      await UserModel.findOne({ username: req.body.username });
      res.send(await UserModel.findOne({ username: req.body.username }));
    });

    //ruta de fallo
    route.get("/fail", (req, res) => {
      res.send("Algo salio mal en el logeo");
    });

    return route;
  }
};
