import jwt from "jsonwebtoken";
import ENVIROMENT from "../src/config/enviroment.js";

const { verify } = jwt;

const secret = ENVIROMENT.SECRET_KEY;

const ValidJWT = async (req, res, next) => {
  let token = req.headers.authorization || "";
  if (typeof token === "object") {
    return res.status(503).json({
      msg: "Not provided token",
    });
  }
  token = token.split(" ")[1] || "";

  if (token) {
    verify(token, secret, async (err, decoded) => {
      if (typeof req.ip === "object") {
        return res.status(503).json({
          msg: "Not provided ip",
        });
      }
      req.body["decoded"] = decoded;

      next();
    });
  } else {
    res.status(503).json({
      msg: "Not provided token 2",
    });
  }
};

export default ValidJWT;
