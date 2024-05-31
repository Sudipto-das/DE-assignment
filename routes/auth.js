const { User } = require('./../schema/index');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { secret } = require('./../middleware/index')
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ username });

    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new User({
        username,
        password: await bcrypt.hash(password, 10),
        role
    });

    await newUser.save();
    res.status(201).json({ msg: 'User created' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '10h' });

    res.json({ token });
});





module.exports = router;