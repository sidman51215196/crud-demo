const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/User");

dotenv.config();
const app = express();

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));


const PORT = process.env.PORT || 5000;

// (C - Create) 
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);// 201 means created
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error: error.message }); // 400 means bad request
  }
});

// (R - Read) 
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }); // to sort in descending order
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 means internal server error
  }
});

// (U - Update) 
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true, runValidators: true }
    ).exec();

    if (!user) return res.status(404).json({ message: "User not found" });// 404 means not found
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error: error.message });  // 400 means bad request
  }
});

// (D - Delete) 
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).exec();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
