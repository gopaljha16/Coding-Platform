require("dotenv").config();
const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const redisWrapper = require("./config/redis");
const authRouter = require("./routes/userAuth");
const problemRouter = require("../src/routes/problemRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const submissionRouter = require("./routes/submit")
const cors = require("cors");
const aiRouter = require("./routes/AiChat");
const videoRouter = require("./routes/Video");
const payRoute = require("./routes/payment");
const interviewRouter = require("./routes/aiInterview");
const contestRouter = require("./routes/contetsRoute");
const playlistRouter = require("./routes/playlistRoute");




const PORT_NO = process.env.PORT_NO;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json());
app.use(cookieParser());
// app.use(rateLimiter)

// routing.
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submissionRouter)
app.use("/ai", aiRouter)
app.use("/video", videoRouter)
app.use("/api/payments", payRoute);
app.use("/api", interviewRouter);
app.use("/contest", contestRouter)
app.use('/playlists', playlistRouter);

const initialConnection = async () => {
    try {
        // Connect to MongoDB
        await database();
        console.log("MongoDB Connected");
        
        // Start the server regardless of Redis connection status
        app.listen(PORT_NO, () => {
            console.log(`Server is Listening on port no ${PORT_NO}`);
        });
        
        // Try to connect to Redis, but don't block server startup
        try {
            await redisWrapper.connect();
            // Redis connection success is logged by the event handler in redis.js
        } catch (redisErr) {
            console.log("Redis connection failed initially, will retry automatically: " + redisErr.message);
            // The application will continue running, and Redis will attempt to reconnect
        }
    } catch (err) {
        console.log("Error connecting to MongoDB: " + err);
        process.exit(1); // Exit if MongoDB connection fails
    }
}


initialConnection();