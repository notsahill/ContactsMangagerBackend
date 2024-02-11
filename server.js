const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/dbConnection");

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api/contacts", require("../Contact Manager App/routes/contactRoutes"));
app.use("/api/users", require("../Contact Manager App/routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {   
console.log(`Server started on port ${port}`);
});

