const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { email, password, bio, avatar } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et password obligatoires" });
    }

    const schema = new passwordValidator();
    schema.is().min(8).has().uppercase().has().digits().has().not().spaces();

    if (!schema.validate(password)) {
      return res.status(400).json({
        message: "Le mot de passe trop faible",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Compte déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      bio,
      avatar,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et password obligatoires" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, is_admin: existingUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      token,
      user: existingUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
