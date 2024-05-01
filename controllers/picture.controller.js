const path = require("path");
const prisma = require("../config/config");
const ImageKit = require("imagekit");

const createPicture = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "error",
        message: "No file provided",
      });
    }

    const fileExtension = path.extname(req.file.originalname);
    const fileBase64 = req.file.buffer.toString("base64");

    const uploadResponse = await ImageKit.upload({
      fileName: Date.now() + fileExtension,
      file: fileBase64,
      folder: "pictures",
    });

    // Menggunakan URL dari respons pengunggahan ImageKit
    const fileUrl = uploadResponse.url;

    const newPicture = await prisma.picture.create({
      data: {
        title,
        description,
        url: fileUrl, // Simpan URL gambar yang sebenarnya
      },
    });

    res.status(201).json({
      status: "success",
      data: newPicture,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deletePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const picture = await prisma.picture.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!picture) {
      return res.status(404).json({
        status: "error",
        message: "Picture not found",
      });
    }

    const deleteResponse = await ImageKit.deleteFile(picture.url);

    if (deleteResponse) {
      await prisma.picture.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: "success",
        message: "Picture deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { createPicture, deletePicture };
