const express = require("express");
const { register, login } = require("../controllers/users.controllers.js");
const router = express.Router();
const { body } = require("express-validator");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestion des utilisateurs
 */
router.post("/", register);
router.post("/login", login);


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Authentification échouée
 */


module.exports = router;
