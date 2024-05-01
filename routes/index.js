var express = require("express");
var router = express.Router();

const { image } = require("../libs/multer");
const {
  createPicture,
  deletePicture,
} = require("../controllers/picture.controller");

/* GET home page. */
router.post("/pictures", image.single("image"), createPicture);
router.delete("/pictures/:id", deletePicture);

module.exports = router;
