import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: path.join(
    __dirname,
    "..",
    "..",
    "..",
    "assets",
    "images",
    "book",
  ),
  filename(req, file, callback) {
    callback(null, file.originalname.replace(/\s/g, ""));
  },
});

const upload = multer({ storage });

export default upload;
