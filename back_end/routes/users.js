const express = require("express");
const User = require("../models/User");
const router = express.Router();

class CustomError extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

router.post("/api/user/register", async (req, res) => {
    const { nik, full_name, email, password, birth_date } = req.body;
    let user;
    try {
        user = await User.findOne({where: {nik: nik}});
        if(user){
            throw new CustomError("NIK already in use.", 409)
        }
        user = await User.findOne({where: {email: email}});
        if(user){
            throw new CustomError("Email already in use.", 409);
        }
        user = await User.create({
          nik,
          full_name,
          email,
          password,
          birth_date,
        });
    } catch (error) {
        console.log(error.statusCode);
        if(error.statusCode == undefined){
            console.log(error.errors);
            
            return res.json(error)
        }
        return res.status(error.statusCode).json(error.message);
    }
    return res.status(201).json({
        "Message": "User has been registered.",
        "User": user
    })
});
router.get("/login", async (res, req) => {

});
router.get("/refresh", async (res, req) => {

});
router.get("/logout", async (res, req) => {

});

module.exports = router;
