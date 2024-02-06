// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("lucky"+err); // Log the error for debugging purposes

  let statusCode = 500; // Default status code for internal server errors
  let errorMessage = "Internal Server Error"; // Default error message

  // Check if the error has a specific status code and message
  if (err.statusCode && typeof err.statusCode === "number") {
    statusCode = err.statusCode;
  }

  if (err.message && typeof err.message === "string") {
    errorMessage = err.message;
  }

  res.status(statusCode).json({ error: errorMessage });
};

module.exports = errorHandler;