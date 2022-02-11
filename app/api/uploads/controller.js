const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(403).json({
        message: 'No file uploaded',
      });
    }
    return res.status(200).json({
      message: 'Upload image success',
      data: { src: `/uploads/${req.file.filename}` },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
