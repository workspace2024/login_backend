const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  try {
    const token = req.headers["access_token"];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log("jwt authorize error");
        return res.status(401).json({
          authorize_error: "jwt authorize error",
          errmsg: err.message,
        });
      }
      req.user = user;
    });
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ Error_c: error.message });
  }
}

module.exports = authorize;
