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
        image_url: fileUrl,
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

const updatePictureOnly = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Invalid user ID",
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

    const fileUrl = response.url;

    const picture = await prisma.picture.update({
      where: {
        id: parseInt(id),
      },
      data: {
        image_url: fileUrl,
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

const deletePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const pictureId = parseInt(id, 10);
    if (isNaN(pictureId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid ID",
      });
    }

    const picture = await prisma.picture.findUnique({
      where: {
        id: pictureId,
      },
    });

    if (!picture) {
      return res.status(404).json({
        status: "error",
        message: "Picture not found",
      });
    }

    const updatedPicture = await prisma.picture.update({
      where: {
        id: pictureId,
      },
      data: {
        image_url: null,
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedPicture,
    });
  } catch (error) {
    console.error("Error in deletePicture:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPicture,
  getPicture,
  getPictureId,
  updatePictureOnly,
  updatePicture,
  deletePicture,
};
