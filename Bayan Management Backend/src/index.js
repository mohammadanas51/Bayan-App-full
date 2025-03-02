  const express = require("express");
  const path = require("path");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const authRoutes = require("./routes/auth");
  const bayanRoutes = require("./routes/bayan");
  const dotenv = require("dotenv").config();

  const app = express();
  const PORT = 8080 ;

  // Middleware 
  app.use(cors()) ; 
  app.use(express.json());
  app.use(express.urlencoded({extended : false}));

  // MongoDB Connection
  mongoose
    .connect("mongodb://127.0.0.1:27017/bayan_management", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Error connecting MongoDB ", err));


  // Routes 
  app.use("/api/auth",authRoutes);
  app.use("/api/bayans",bayanRoutes);


  // Start Server
  app.listen(PORT , () => {
      console.log(`Server started at ${PORT}`);
  });