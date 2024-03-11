import jwt from "jsonwebtoken"

const generateAuthToken=(id)=>{
 
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 7 * 24 * 60 * 60 })
  return token
}

export {generateAuthToken}


