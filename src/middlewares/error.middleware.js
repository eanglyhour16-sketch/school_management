const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  if (err.code === 11000 || err.message === "Student code already exists") {
    return res.status(400).json({
      success: false,
      message: "Student code already exists",
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID",
    });
  }

  const statusCode =
    err.statusCode ||
    (err.message === "Student not found" ? 404 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;