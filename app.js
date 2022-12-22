const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

// express app
const app = express();
app.use(express.json());
app.use(cookieParser());

// connect to mongodb & listen for requests
const dbURI =
  "mongodb+srv://atq03:john123@calendar.ai1we4z.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3010))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

app.get("/createEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/createEvent.html"));
});

app.get("/eventDetails/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/detailEvents.html"));
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
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("*", checkUser);

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// event routes
app.use("/events", eventRoutes);

// blog routes
app.use("/blogs", blogRoutes);

// User routes
app.use(authRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
