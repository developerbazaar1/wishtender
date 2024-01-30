const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, "somesupersecretsecret");
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware in the stack
  }
};
