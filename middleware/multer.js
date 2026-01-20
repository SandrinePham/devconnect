const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),

  filename: (req, file, callback) => {
    //test.png => 1623423423-test.png
    const unique = Date.now() + "-" + Math.round(Math.random() * 10000);
    callback(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isExtensionValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  if (isExtensionValid && isMimeTypeValid) callback(null, true);
  else callback(new Error("Seules les images sont autorisées"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 Mo
});

module.exports = upload;