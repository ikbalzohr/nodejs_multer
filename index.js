const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

const blogRoutes = require("./routes/blog");
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json()); //body-parser
app.use("/images", express.static(path.join(__dirname, "images"))); //unlock api methode GET for akses ke path ./images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(cors());

app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 4000;
const dbName = "NodeJs_server";
const mongoAtlasUri = `mongodb+srv://ikbalzohr:atlas@cluster0.f4kio.mongodb.net/${dbName}?retryWrites=true&w=majority`;

try {
  // connect to the MongoDb cluster
  mongoose.connect(
    mongoAtlasUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log("Midleware mongoose telah koneksi...")
  );
  app.listen(PORT, () => console.log("Server Hidup Dan berjalan..."));
} catch (e) {
  console.log("could not connect...");
}

const db = mongoose.connection;
db.on("error", (err) => console.log(`Koneksi error. rincian : ${err}`));
db.once("open", () => console.log("Terkoneksi dengan DataBase!"));
