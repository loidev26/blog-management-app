const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth.js");
const { errorHandler } = require("../auth");

// Register User
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check email format
        if (!email || !email.includes("@")) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // Check password length
        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long."
            });
        }

        // Check for duplicate email
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(409).json({
                message: "Username is already taken."
            });
        }

        // Create new user
        const newUser = new User({
            email,
            username,
            password: bcrypt.hashSync(password, 10)
        });

        const result = await newUser.save();

        return res.status(201).json({
            message: "Registration successful!",
            user: {
                _id: result._id,
                email: result.email,
                username: result.username
            }
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

// User Login
module.exports.loginUser = (req, res) => {
    const { identifier, password } = req.body;

    return User.findOne({
        $or: [
            { email: identifier },
            { username: identifier }
        ]
    })
        .then(result => {
            if (result == null) {
                return res.status(401).send(false);
            }

            const isPasswordCorrect = bcrypt.compareSync(
                password,
                result.password
            );

            if (isPasswordCorrect) {
                return res.status(200).send({
                    access: auth.createAccessToken(result)
                });
            } else {
                return res.status(401).send(false);
            }
        })
        .catch(error => errorHandler(error, req, res));
};