const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Static Files (Ensure 'public' and 'uploads' directories exist)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection (With Recommended Options)
mongoose.connect("mongodb://localhost:27017/Database", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1); // Exit if the database connection fails
  });

// ✅ User Schema for Registration
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phno: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bloodGroup: String,
  age: Number,
  diet: String
});
const User = mongoose.model("User", userSchema);

// ✅ Donor Schema for Blood Donation Registration
const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: { type: String, required: true },
  age: { type: Number, required: true },
  diet: { type: String, required: true },
  address: { type: String, required: true },
  phno: String,
  bloodReport: String
});
const Donor = mongoose.model("Donor", donorSchema);

// ✅ Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ User Registration Route
app.post("/sign_up", async (req, res) => {
  try {
    const { name, email, phno, password } = req.body;
    if (!name || !email || !phno || !password) {
      return res.status(400).json({ message: "❌ All fields are required!" });
    }

    const existingUser = await User.findOne({ phno });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Already registered! Go to Login." });
    }

    const newUser = new User({ name, email, phno, password });
    await newUser.save();

    res.json({ message: "✅ Registration successful!", redirect: "/index2.html" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "❌ Error registering user" });
  }
});

// ✅ User Login Route
app.post("/login", async (req, res) => {
  try {
    const { phno, password } = req.body;
    const user = await User.findOne({ phno });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "❌ Invalid credentials!" });
    }

    res.json({ message: "✅ Login successful!", redirect: "/index2.html" });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "❌ Error logging in" });
  }
});

// ✅ Donor Registration Route
app.post("/register_donor", upload.single("bloodReport"), async (req, res) => {
  try {
    const { bloodGroup, age, diet, address, name, phno } = req.body;

    if (!bloodGroup || !age || !diet || !address || !name || !phno) {
      return res.status(400).json({ message: "❌ All fields except blood report are required!" });
    }

    const newDonor = new Donor({
      name,
      phno,
      bloodGroup,
      age,
      diet,
      address,
      bloodReport: req.file ? req.file.filename : null
    });

    await newDonor.save();
    res.json({ message: "✅ Donor registered successfully!" });
  } catch (err) {
    console.error("❌ Error registering donor:", err);
    res.status(500).json({ message: "❌ Error registering donor" });
  }
});

// ✅ Fetch User Details (Fixed to Fetch by Phone Number)
app.get("/get_user", async (req, res) => {
  try {
    const { phno } = req.query;
    if (!phno) {
      return res.status(400).json({ message: "❌ Phone number is required!" });
    }

    const user = await User.findOne({ phno });
    if (!user) return res.status(404).json({ message: "❌ User not found!" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "❌ Error fetching user" });
  }
});
// ✅ Search Blood Donors (Fixed Response Handling)
app.get("/search_blood_group", async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    if (!bloodGroup) {
      return res.status(400).json({ message: "❌ Blood group is required!" });
    }

    const donors = await Donor.find({ bloodGroup });

    if (donors.length > 0) {
      res.json({ success: true, donors });
    } else {
      res.json({ success: false, message: "⚠️ No donors found for this blood group." });
    }
  } catch (err) {
    console.error("❌ Error searching blood group:", err);
    res.status(500).json({ message: "❌ Error searching blood group" });
  }
});

// ✅ Update Profile API (Fixed)
app.post("/update_profile", async (req, res) => {
  try {
    const { name, email, phno, bloodGroup, age, diet } = req.body;
    if (!phno) {
      return res.status(400).json({ message: "❌ Phone number is required!" });
    }

    const user = await User.findOneAndUpdate(
      { phno },
      { name, email, bloodGroup, age, diet },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "❌ User not found!" });

    res.json({ success: true, message: "✅ Profile updated successfully!", user });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "❌ Error updating profile" });
  }
});
// ✅ Update Profile in MongoDB (Now Requires Phone Number)
app.post("/update_profile", async (req, res) => {
  try {
    const { name, email, phno, bloodGroup, age, diet } = req.body;
    if (!phno) {
      return res.status(400).json({ message: "❌ Phone number is required!" });
    }

    const user = await User.findOneAndUpdate(
      { phno },
      { name, email, bloodGroup, age, diet },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "❌ User not found!" });

    res.json({ success: true, message: "✅ Profile updated successfully!", user });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "❌ Error updating profile" });
  }
});

// ✅ Start the server
const PORT = 3019;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
