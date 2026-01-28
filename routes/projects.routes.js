const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  commentProject,
} = require("../controllers/projects.controller.js");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Gestion des projets
 */

router.get("/", getProjects);
router.get("/:id", getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Projet créé
 *       400:
 *         description: Titre obligatoire
 *       401:
 *         description: Token obligatoire
 */

router.post("/", auth, upload.single("image"), createProject);
router.put("/:id", auth, upload.single("image"), updateProject);
router.delete("/:id", auth, deleteProject);
router.post("/:id/like", auth, likeProject);
router.post("/:id/comment", auth, commentProject);

module.exports = router;
