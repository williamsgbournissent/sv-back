import prisma from "../config/dbConnect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email: email } });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: foundUser.role,
            name: foundUser.name,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );

      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "180s" }
      );

      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { refreshToken: refreshToken },
      });

      if (!updatedUser) {
        console.error("Failed to update refreshToken in the database");
        return res.status(500).json({ message: "Internal Server Error" });
      }

      console.log("Refresh token updated successfully:", updatedUser);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ role: updatedUser.role, accessToken, name: updatedUser.name });
    }
  } catch (error) {
    console.error("Error updating refreshToken:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
