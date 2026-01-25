import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  fileName: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${unique}${safeExt}`);
  },
});
// filefilter: only accept jpg, jpeg, png, webp

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLocaleLowerCase(),
  ); // check to see if user has an allowed file type
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
    // error of null, success is true
  } else {
    cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});
