const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { checkUser } = require("./middleware/authMiddleware");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

// express app
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));

// register view engine
app.set("view engine", "ejs");

// Render HTML Pages
app.get("/createEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/createEvent.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/events.html"));
});

app.get("/event/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/eventDetails.html"));
});

app.get("/createAllDayEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/createAllDayEvent.html"));
});

// middleware & static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("*", checkUser);

// routes
app.get("/", (req, res) => {
  res.render("index");
  // res.redirect("/blogs");
});

// Event routes
app.use("/events", eventRoutes);

// User routes
app.use(userRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
