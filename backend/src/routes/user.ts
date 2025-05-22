import express from "express";
import {
  signinSchema,
  signupSchema,
  updateUserSchema,
} from "../lib/validation";
import { Account, User } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { authMiddleware } from "../lib/middleware";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const success = signupSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
    return;
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    res.status(411).json({
      message: "User already exists",
    });
    return;
  }

  const { username, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = User.create({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  const userId = (await user)._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET!
  );

  res.status(200).json({
    message: "Sign up successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const success = signinSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
    return;
  }

  const { username, password } = req.body;

  const user = await User.findOne({
    username,
  });

  if (!user) {
    res.status(401).json({
      message: "Invalid username or password",
    });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      message: "Invalid username or password",
    });
    return;
  }

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET!
    );

    res.status(200).json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateUserSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        });
        return;
    }

    // Hash password if it's present in the update
    if (req.body.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
            res.status(500).json({
                message: "Error hashing password"
            });
            return;
        }
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    });
});


router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.status(200).json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
