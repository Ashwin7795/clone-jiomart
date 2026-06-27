const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpStore = {};

const registerUser = async (req, res) => {
  try {
    const { name, email,phone, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

  res.status(201).json({
  message: "User registered successfully",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log(
      `OTP for ${phone}: ${otp}`
    );

    res.status(200).json({
  message: "OTP sent successfully",
  otp,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    

    const storedOtp = otpStore[phone];

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete otpStore[phone];

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ phone });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete otpStore[phone];

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
};