const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const http = require("http");
const { Server } = require("socket.io");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userModel = require("./model/userModel");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

const Client = process.env.FRONT_END_URL || "http://localhost:3000";

console.log(Client);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: Client } });

// Increase the request size limit
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// Set up MongoDB session store
const mongoDBStore = new MongoDBStore({
  uri: process.env.MOONGOSE_URI,
  collection: "sessions",
});

// Catch session store errors
mongoDBStore.on("error", (error) => {
  console.log(error);
});

//middle ware
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({ credentials: true, origin: Client }));
app.use(cookieParser());
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoDBStore,
    cookie: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google OAuth 2.0 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avator: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, false, {
          message: "Something went wrong, please try again.",
        });
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//import routes
const user = require("./routes/user");
const deliveryuser = require("./routes/deliveryUser");
const profile = require("./routes/profile");
const categoary = require("./routes/category");
const product = require("./routes/products");
const cart = require("./routes/cart");
const favorites = require("./routes/favourite");
const coupon = require("./routes/coupons");
const payment = require("./routes/payments");
const orders = require("./routes/orders");
const delivery = require("./routes/delivery");

// app.use("/", async (req, res) => {
//   res.send("welcome");
// });

// routes
app.use("/auth", user);
app.use("/auth", deliveryuser);
app.use("/auth", profile);
app.use("/auth", categoary);
app.use("/auth", product);
app.use("/auth", cart);
app.use("/auth", favorites);
app.use("/auth", coupon);
app.use("/auth", payment);
app.use("/auth", orders);
app.use("/auth", delivery);

//

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("chatMessage", (msg) => {
    console.log("Message received:", msg);
    io.emit("chatMessage", msg);
  });
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;

// Database connection
mongoose
  .connect(process.env.MOONGOSE_URI)
  .then(() => console.log("connected to DB"))
  .catch((error) => console.log(error));

// Server listening
server.listen(PORT, () => console.log("server connected to ", { PORT }));
