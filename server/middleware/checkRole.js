// middleware/checkRole.js
const checkRole = (requiredRole) => {
    return (req, res, next) => {
     
      if ('fighter' !== requiredRole) {
        const error = new Error("Unauthorized. Insufficient role.");
        error.statusCode = 403;
        return next(error);
      }
  
      // If the user has the required role, continue to the next middleware or route handler
      next();
    };
};

module.exports = checkRole;
  