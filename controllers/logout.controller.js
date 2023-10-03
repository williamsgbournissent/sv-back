import prisma from "../config/dbConnect.js";

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    const refreshTokenArray = Array.isArray(foundUser.refreshToken)
      ? foundUser.refreshToken
      : [];

    const filteredRefreshTokenArray = refreshTokenArray.filter(
      (rt) => rt !== refreshToken
    );

    const updatedRefreshToken = filteredRefreshTokenArray.join(",");

    const updatedUser = await prisma.user.update({
      where: {
        id: foundUser.id,
      },
      data: {
        refreshToken: updatedRefreshToken,
      },
    });

    console.log(updatedUser);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    await prisma.$disconnect();
  }
};
