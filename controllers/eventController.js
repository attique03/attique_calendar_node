const Event = require("../models/eventModel");
const path = require("path");

const getAllEvents = (req, res) => {
  Event.find({ user: req.user._id })
    .then((result) => {
      const events = result.filter((event) => event.allDay === false);
      res.json(events);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllDayEvents = (req, res) => {
  Event.find({ user: req.user._id })
    .then((result) => {
      const allday = result.filter((event) => event.allDay === true);
      res.json(allday);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEventById = (req, res) => {
  const id = req.params.id;
  Event.findById({ _id: id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

const updateEvent = (req, res) => {
  const id = req.params.id;
  const { startTime, endTime, name, location } = req.body;

  Event.findByIdAndUpdate({ _id: id }, { startTime, endTime, name, location })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("Updatation Error ", err);
    });
};

const deleteEvent = (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/events" });
    })
    .catch((err) => {
      console.log("Deletion Error => ", err);
    });
};

const createEvent = (req, res) => {
  const { startTime, endTime, name, location } = req.body;
  const event = new Event({
    startTime,
    endTime,
    name,
    location,
    allDay: false,
    user: req.user._id,
  });

  event
    .save()
    .then(() => {
      res.sendFile(path.join(__dirname, "../views/events.html"));
    })
    .catch((err) => {
      console.log(err);
    });
};

const createAllDayEvent = (req, res) => {
  const { name, location } = req.body;

  const event = new Event({
    startTime: "null",
    endTime: "null",
    name,
    location,
    allDay: true,
    user: req.user._id,
  });
  event
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createAllDayEvent,
  getAllDayEvents,
};
