var express = require("express");
var router = express.Router();

const { image } = require("../libs/multer");
const {
  createPicture,
  getPicture,
  getPictureId,
  updatePictureOnly,
  updatePicture,
  deletePicture,
} = require("../controllers/picture.controller");

/* GET home page. */
router.post("/pictures", image.single("image"), createPicture);
router.get("/pictures", getPicture);
router.get("/pictures/:id", getPictureId);
router.patch("/pictures-only/:id", image.single("image"), updatePictureOnly);
router.put("/pictures/:id", updatePicture);
router.delete("/pictures/:id", deletePicture);

module.exports = router;
