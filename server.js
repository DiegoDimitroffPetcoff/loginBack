const express = require("express");

const app = express();
const PORT = 3000

const routes = require("./routes/routes")
const  Routes = new routes()
app.use(Routes.start())



app.listen(PORT, ()=>{
    console.log("PORT LISTENTING SUCCESSFULLY")
})