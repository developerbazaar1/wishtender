async function errorMiddleware(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const status = error.status || "error"; // Default to 'error' if status is not provided
  const message = error.message || "Internal Server Error"; // Default message for internal server errors
  const data = error.data || null; // Default data to null if not provided
  // console.error("error in errorMiddleWare status", statusCode);
  // console.error("error in errorMiddleWare error message", message);
  // console.error("error in errorMiddleWare error data", data);
  return res.status(statusCode).json({ status, message, data });
}

module.exports = errorMiddleware;
