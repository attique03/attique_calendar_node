const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createAllDayEvent,
  getAllDayEvents,
} = require("../controllers/eventController");

const { checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createAllDay", checkUser, createAllDayEvent);
router.get("/allevents", checkUser, getAllEvents);
router.get("/allDayEvents", checkUser, getAllDayEvents);
router.delete("/delete/:id", checkUser, deleteEvent);
router.put("/update/:id", checkUser, updateEvent);
router.get("/getEvent/:id", checkUser, getEventById);
router.post("/", checkUser, createEvent);

module.exports = router;
