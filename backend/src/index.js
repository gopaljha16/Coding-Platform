require("dotenv").config();
const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const redisClient = require("./config/redis");
const authRouter = require("./routes/userAuth");
const problemRouter = require("../src/routes/problemRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const submissionRouter = require("./routes/submit")
const cors = require("cors");
const aiRouter = require("./routes/AiChat");
const videoRouter = require("./routes/Video");
const payRoute = require("./routes/payment");


const PORT_NO = process.env.PORT_NO;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json());
app.use(cookieParser());
// app.use(rateLimiter)

// routing.
app.use("/user" , authRouter);
app.use("/problem" , problemRouter);
app.use("/submission" , submissionRouter)
app.use("/ai" , aiRouter)
app.use("/video" , videoRouter)
app.use("/api/payments" , payRoute);


const initialConnection = async () =>{
    try{
        await Promise.all([
         redisClient.connect(),
         database(),
        ])
        console.log("Databases Connected")

        app.listen(PORT_NO , () =>{
            console.log(`Server is Listening on port no ${PORT_NO}`);
        })

    }catch(err){
        console.log("Error :-  " + err);
    }
}


initialConnection();