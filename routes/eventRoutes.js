const express = require("express");
//const blogController = require('../controllers/blogController');
const {
  event_create_get,
  event_create_post,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createAllDayEvent,
  getAllDayEvents,
} = require("../controllers/eventController");

const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createAllDay", checkUser, createAllDayEvent);
router.get("/allevents", checkUser, getAllEvents);
router.get("/allDayEvents", checkUser, getAllDayEvents);
router.delete("/delete/:id", checkUser, deleteEvent);
router.put("/update/:id", checkUser, updateEvent);
router.get("/getEvent/:id", checkUser, getEventById);
router.post("/", checkUser, event_create_post);
router.get("/createEvent", event_create_get);

// router.post("/:id/edit", blogController.blog_update_put);
// router.get("/create", blogController.blog_create_get);
// router.get("/", blogController.blog_index);
// router.post("/", checkUser, blogController.blog_create_post);
// router.get("/:id", blogController.blog_details);
// router.delete("/:id", blogController.blog_delete);
// router.get("/:id/edit", blogController.single_blog_details);

module.exports = router;
