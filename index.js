const express = require("express");
const app = express();
const mongoose = require("mongoose");
const print = console.log;
const cors = require("cors");

const shoppingRoutes = require("./api/shopping");
const port = process.env.PORT || 8003;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Define the allowed origins
const allowedOrigins = [
  'https://webstore-frontend-9669.onrender.com', 
  'https://webstore-userservice.onrender.com',
  'http://localhost:3000' // Add this for local testing
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Origin:', origin); // Log the origin for debugging
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); // Apply the CORS middleware with the custom options
app.options('*', cors(corsOptions)); // Preflight request handling for all routes

const { CreateChannel } = require("./utils");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Connection successful");

    const channel = await CreateChannel();

    shoppingRoutes(app, channel);
    app.listen(port, () => {
      console.log(`Order Service is listening on Port ${port}`);
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

startApp();
