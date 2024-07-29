require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const PORT = process.env.PORT || 4000;

//app
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/", productRoutes);
app.use("/auth", usersRoutes);
app.use("/cart", cartRoutes);

//Connecting to mongoDB and starting the server only if the connection worked
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `connected to DB and listening running on : http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
