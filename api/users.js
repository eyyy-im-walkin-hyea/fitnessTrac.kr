/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser, getUser } = require("../db/users");

router.use((req,res,next) => {
    console.log("A request is being made to /users");

    next();

});
// POST /api/users/register
router.post("/api/users/register", async (req,res,next) => {
    const {username, password} = req.body 
    try {
        const _user = await getUserByUsername(username);

        if (_user) { // If a user by that name already exists. 
            next({
                name: "User Already Exists.",
                message: "A user by that name already exists."
            })
        };

        if (password.length <= 8) {
            next({
                name: "Password Too Short",
                message: "Password must be a minimum of 8 characters."
            })
        }

        const user = await createUser({username, password});

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: "1w"
        });

        res.send({
            message: "Thank you for signing up to our website!",
            token
        }).status(200);
        
    } catch ({name, message}) {
        next({name, message});
    }
});
// POST /api/users/login
router.post("/api/users/login", async (req,res,next) => {
    const { username, password } = req.body;

    if (!username || !password) { // Request body must have both a username & password.
        next({
            name: "Missing Credentials!",
            message: "Please supply both a username and password!"
        });
    };

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) { // If the user exists & user password matches password from the request body...
            const token = jwt.sign({ // Create token that has users ID & username encrypted by JWT SECRET.
                id: user.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: "1w"
            });
             // Create token 
            res.send({                                              // Sending token & successful log-in message back to user. 
                message: "You are now logged in!",
                token: token
            }).status(200);

        } else {
            next({
                name: "Incorrect Credentials!",
                message: "Username or password is incorrect!"
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }

});

// GET /api/users/me
router.get("/api/users/me", async (req,res,next) => {
    try {
        const individualUser = req.body;
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env)
    } catch ({name, message}) {
        next({name, message});
    }
})

// GET /api/users/:username/routines

module.exports = router;