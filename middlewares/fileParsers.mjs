// import multer from 'multer';

// const storage = multer.memoryStorage()

// const memberIDParser = multer({ storage, limits: { fileSize: 200000, files: 1 }}).single('member_id')

//uncomment from here downwards
// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./");
//   },
//   filename: function (req, file, cb) {
//     cb(null,  String(Date.now()) + Math.random()*100 + file.originalname);
//   },
// });

// const memberIDParser = multer({
//   storage: storage,
//   limits: { fileSize: 600000, files: 1 }, // 600 KB = 600,000 bytes
// }).single('member_id');


// export { memberIDParser }



//file changed from here

import multer from "multer";
import path from "path";
import fs from "fs";

const tempUploadDir = path.join(process.cwd(), "uploads/tmp");

// Ensure directory exists (extra safety)
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.replace(/\s+/g, "_");

    cb(null, uniqueName);
  },
});

const memberIDParser = multer({
  storage,
  limits: {
    fileSize: 600000, // 600 KB
    files: 1,
  },
}).single("member_id");

export { memberIDParser };
