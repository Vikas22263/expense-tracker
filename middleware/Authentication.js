import jwt from "jsonwebtoken";

const Checkjwttoken = async (req, res, next) => {
  try {
    const tokenFromCookie =
      (req.cookies["Bearer"] || "").split("Bearer ")[1] || "";
    const tokenFromHeader =
      (req.headers.authorization || "").split("Bearer").filter(Boolean)[0] ||
      "";

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return res
        .status(401)
        .json({ StatusCode: 401, Message: "Unauthorized: No token provided" });
    }

    const verifytoken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifytoken);
    if (!verifytoken) {
      return res
        .status(401)
        .json({ StatusCode: 401, Message: "Unauthorized: Invalid token" });
    }
   if(verifytoken){
     req.Userid = verifytoken.id.id;
    req.Ispremium = verifytoken.id.Ispremium;
    next();
   }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ StatusCode: 401, Message: "Unauthorized: Invalid token" });
  }
};

export default Checkjwttoken;
