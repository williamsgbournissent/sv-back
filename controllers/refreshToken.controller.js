import prisma from "../config/dbConnect.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
          return res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
              role: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10s" }
        );
        res.json({ role: foundUser.role, accessToken, name: foundUser.name });
      }
    );
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export { handleRefreshToken };
