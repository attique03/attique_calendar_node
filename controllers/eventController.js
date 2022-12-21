const Event = require("../models/event");

const event_create_get = (req, res) => {
  res.render("createEvent");
};

const getAllEvents = (req, res) => {
  Event.find({ user: req.user._id })
    // .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
      //   res.render("index", { blogs: result, title: "All blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEventById = (req, res) => {
  const id = req.params.id;
  console.log("Id ", id);
  Event.findById({_id: id})
    .then((result) => {
      res.json(result);
      // res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      // res.render("404", { title: "Blog not found" });
    });
};

const updateEvent = (req, res) => {
  // const id = req.body.id;
  const { id, startTime, endTime, name, location } = req.body;
  console.log("dkfjsldkf d ", id, location);

  Event.findByIdAndUpdate({ _id: id }, { startTime, endTime, name, location })
    .then((result) => {
        res.json(result);
      console.log("Result ===> ", result);
      //   res.redirect("/blogs");
    })
    .catch((err) => {
      console.log("Updatation Error ", err);
    });
};

const deleteEvent = (req, res) => {
    const id = req.body.id;
    Event.findByIdAndDelete(id)
      .then((result) => {
        res.json({ redirect: "/blogs" });
      })
      .catch((err) => {
        console.log("Deletion Error => ",err);
      });
  };

const event_create_post = (req, res) => {
  const { startTime, endTime, name, location } = req.body;
  console.log("Create event ", req.body);
  // const blog = new Blog(req.body);
  //   console.log("Inside Create ==>", req.body, req.user._id);
  const event = new Event({
    startTime,
    endTime,
    name,
    location,
    user: req.user._id,
  });

  console.log("Body Data ", req.body);
  console.log("USer ===> ", req.user);
  event
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  event_create_post,
  event_create_get,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
