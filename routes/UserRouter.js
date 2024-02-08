const express = require("express");
const UserModel = require("../models/Usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorize = require("../auth/authorize");

const router = express.Router();
const secretkey = process.env.SECRET_KEY;

router.get("/", async (req, res) => {
  try {
    const alluser = await UserModel.findAll({});
    res.status(200).json({ alluser });
  } catch (error) {
    res.status(400).json({ Error: `${error}` });
    console.log(error);
  }
});

router.post("/adduser", async (req, res) => {
  try {
    const { FName, LName, Email, Password } = req.body;
    const findUser = await UserModel.findOne({
      where: {
        Email,
      },
    });
    if (findUser) {
      return res.status(400).json({ Status: "User ALready exsits" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(Password, salt);
    const insert_User = await UserModel.create({
      FName,
      LName,
      Email,
      Password: hashPassword,
    });
    await insert_User.save();
    res.status(201).json({ status: "Successfull", user: insert_User });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
});

router.put("/update", authorize, async (req, res) => {
  try {
    const { Email, FName, LName } = req.body;
    if (req.user.Email != Email) {
      return res.status(401).json({ user_err: "Invalid User" });
    }
    const findUser = await UserModel.findOne({
      where: {
        Email,
      },
    });
    if (!findUser) {
      return res.status(400).json({ Status: "User Not Found" });
    }
    findUser.set({
      FName: FName ? FName : findUser.FName,
      LName: LName ? LName : findUser.LName,
    });
    await findUser.save();
    console.log(req.user);
    res.status(201).json({ Status: "Successfull" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ Error: error });
  }
});

router.put("/update_email", async (req, res) => {
  try {
    const { Email, updated_Email } = req.body;
    const findUser = await UserModel.findOne({
      where: {
        Email,
      },
    });
    if (!findUser) {
      return res.status(400).json({ Status: "User Not Found" });
    }
    findUser.set({
      Email: updated_Email,
    });
    await findUser.save();
    res.status(201).json({ Status: "Successfull" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ Error: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const find_User = await UserModel.findOne({
      where: {
        id,
      },
    });
    if (!find_User) {
      return res.status(400).json({ Error: "User Not Found,Unable to Delete" });
    }
    await UserModel.destroy({
      where: {
        id,
      },
    });
    res.status(204).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ Error: `${error.message}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const findUser = await UserModel.findOne({
      where: { Email },
    });
    if (!findUser) {
      return res.status(400).json({ Error: "User Not Found,Unable to Login" });
    }
    const compare_pass = await bcrypt.compare(Password, findUser.Password);
    if (!compare_pass) {
      return res.status(401).json({ Error: "Invalid Password" });
    }
    const token = jwt.sign(
      {
        id: findUser.id,
        FName: findUser.FName,
        LName: findUser.LName,
        Email: findUser.Email,
      },
      secretkey,
      {
        expiresIn: "30m",
      }
    );
    res
      .cookie("access_token", token)
      .status(200)
      .json({
        message: "User Logged In Successfull",
        User_Details: { FName: findUser.FName, LName: findUser.LName, Email },
      });
  } catch (error) {
    res.status(400).json({ Error: `${error.message}` });
    console.log(error);
  }
});

module.exports = router;
