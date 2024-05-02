const path = require("path");
const prisma = require("../config/config");
const ImageKit = require("../libs/imagekit");

const createPicture = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: "error",
        message: "Title and description are required",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "error",
        message: "No file provided",
      });
    }

    const fileBase64 = req.file.buffer.toString("base64");

    const response = await ImageKit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: fileBase64,
      folder: "pictures",
    });

    // Menggunakan URL dari respons pengunggahan ImageKit
    const fileUrl = response.url;

    const newPicture = await prisma.picture.create({
      data: {
        title,
        description,
        image_url: fileUrl, // Simpan URL gambar yang sebenarnya
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

const getPicture = async (req, res) => {
  try {
    const pictures = await prisma.picture.findMany();

    res.status(200).json({
      status: "success",
      data: pictures,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

//get image by id
const getPictureId = async (req, res) => {
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

    res.status(200).json({
      status: "success",
      data: picture,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

//update title dan description
const updatePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    console.log(id);
    console.log(title, description);

    if (!id) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const picture = await prisma.picture.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({
      status: "success",
      data: picture,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

//delete image_url saja
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

    // Menghapus entri dari database
    const deletedPicture = await prisma.picture.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Menghapus gambar dari penyimpanan dengan metode yang benar
    const fileUrl = picture.image_url; // Pastikan nama field sesuai dengan skema Prisma
    const fileName = fileUrl.split("/").pop(); // Dapatkan nama file
    const fileId = fileName.split(".")[0];

    // Pastikan menggunakan metode yang benar untuk menghapus file
    await ImageKit.deleteFile(fileId); // `deleteFile`, bukan `delete`

    res.status(200).json({
      status: "success",
      data: deletedPicture,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createPicture,
  getPicture,
  getPictureId,
  updatePicture,
  deletePicture,
};
