require("dotenv").config();
const express = require("express");
const app = express();
const database = require("./config/database");

const PORT_NO = process.env.PORT_NO

app.use(express.json());


database()
.then(() =>{
    console.log("Database has started")
    app.listen(PORT_NO , () =>{
        console.log(`Server is Listening on port no ${PORT_NO}`);
    })
})
.catch((err) =>{
    console.log("Error : "  + err.message);
})
