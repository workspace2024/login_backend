const express = require("express");
const body_parser = require("body-parser");
const db = require("./config/config");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(morgan("combined"));
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/v1/users", require("./routes/UserRouter"));

//DB Connection
db.authenticate()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Error", err));

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
