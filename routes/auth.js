const express = require('express')
const router = express.Router()
const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchUser')
const mongoose = require('mongoose')
const axios = require('axios')

router.post('/createUser', async (req, res) => {
    try {
        const data = req.body
        const { name, email, password, about, username, imageUrl } = data;
        // const ress = await axios.get(imageUrl, {
        //     method: 'GET'
        // });
        // if (ress.status != 200) {
        //     imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU";
        // }
        const userEmailExists = await User.findOne({ email })
        const userNameExists = await User.findOne({ username })
        if (userEmailExists || userNameExists) {
            res.status(422).json({ 'Warning': 'User already exists' })
        }
        else {
            const hashedPass = await bcrypt.hash(password, 10)
            const saveUser = await new User({ name, email, about, username, imageUrl, 'password': hashedPass })
            const user = {
                _id: saveUser._id
            }
            const authToken = jwt.sign({ user }, process.env.SECRET_KEY)
            await saveUser.save()
            res.json({ 'Success': 'User Saved', authToken, name: saveUser.name, username: saveUser.username, imageUrl: saveUser.imageUrl, _id: saveUser._id, about: saveUser.about })
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const userExists = await User.findOne({ username: data.username })
        if (!userExists) {
            res.status(400).json({ 'Error': "No User Exists" })
        }
        else {
            const passMatch = await bcrypt.compare(data.password, userExists.password)
            if (!passMatch) {
                res.status(400).json({ 'Error': "Wrong Credentials" })
            }
            else {
                // res.json(userExists)
                const user = {
                    _id: userExists._id
                }
                const authToken = jwt.sign({ user }, process.env.SECRET_KEY)
                res.json({ 'Success': true, authToken })
            }

        }
    } catch (err) {
        console.log(err);
    }
})

//Get user
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({ _id: userId })
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})

router.get('/getuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            // Handle invalid ObjectID format
            return res.status(400).json({ error: 'Invalid ObjectID format' });
        }
        const objId = new mongoose.Types.ObjectId(userId)
        const user = await User.findOne({ _id: objId })
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})
router.get('/getusers', async (req, res) => {
    try {
        // const userId= req.params.id;
        // const user = await User.findOne({_id:userId})
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error);
    }
})
router.patch('/updateUser', fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, username, imageUrl, about } = req.body
        if(email || username){
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email or username already exists' });
            }
        }
        const updUser = await User.findByIdAndUpdate(userId, { name, email, username, imageUrl, about },{ new: true })
        await updUser.save()
        res.json(updUser)
    } catch (err) {
        console.log(err);
    }
})

module.exports = router