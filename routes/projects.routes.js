const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  getProjects,
  getProject,
  createProject,
} = require("../controllers/projects.controller.js");
const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", auth, upload.single("image"), createProject);


module.exports = router;
