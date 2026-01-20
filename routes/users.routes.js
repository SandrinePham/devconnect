const express = require('express');
const {register, login} = require ("../controllers/users.controllers.js");
const router = express.Router();
const {body} = require ('express-validator');

router.post('/', register);
router.post('/login', body('email').isEmail(), login);

module.exports = router;
  