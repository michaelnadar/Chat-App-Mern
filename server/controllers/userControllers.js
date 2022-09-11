const User = require("../model/userModel");
const cryptoJS = require("crypto-js");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
      const hashedPassword = cryptoJS.AES.encrypt(password,process.env.HASHEDPASSWORD).toString();
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req,res,next) =>{
  try {
      const { username,  password } = req.body;
      const user = await User.findOne({ username });
      if (!user)
        return res.json({ msg: "Username or password is Incorrect", status: false });
        const hashedPassword = cryptoJS.AES.decrypt(user.password,process.env.HASHEDPASSWORD);
    const isPasswordValid = hashedPassword.toString(cryptoJS.enc.Utf8);
      if (isPasswordValid !==password)
        return res.json({ msg: "Username or password is Incorrect", status: false });
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
     const userid = req.params.id;

     const avatarImage = req.body.image;
     
     const userData =  await User.findByIdAndUpdate(userid,
      
      {
        isAvatarImageSet:true,
        avatarImage},
        { new: true }
      
      );
      return res.json({isSet:userData.isAvatarImageSet,image:userData.avatarImage});
  } catch (ex) {
    next(ex);
  }
};
module.exports.getAllUsers = async (req,res,next) =>{
 try {
  const users = await User.find({_id:{$ne:req.params.id}}).select([
    "username",
    "avatarImage",
    "email",
    "_id"
  ]);
  return res.json(users);
 } catch (ex) {
  next(ex);
  
 }
};
