import prisma from "../config/dbConnect.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { email, password, name, role, timestamp, refreshToken } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  const userFounded = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userFounded) {
    return res.status(400).json({ message: "The email alredy exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    email,
    password: hashedPassword,
    name,
    role,
    timestamp,
    refreshToken
  };

  const user = await prisma.user.create({ data: userObject });

  if (user) {
    return res.status(201).json({ message: `The user ${name} was created` });
  } else {
    return res.status(400).json({ message: "Error creating user" });
  }
};
