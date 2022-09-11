const { getAllmsg, addMsg } = require("../controllers/messageControllers");


const router = require("express").Router();

router.post("/getmsg",getAllmsg);
router.post("/addmsg",addMsg);
module.exports = router;