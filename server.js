const express = require("express");
const cors = require("cors")

const app = express();
app.use(cors())
const PORT = 3000

const routes = require("./routes/routes")
const  Routes = new routes()
app.use(Routes.start())



app.listen(PORT, ()=>{
    console.log("PORT LISTENTING SUCCESSFULLY")
})