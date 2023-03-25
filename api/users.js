/* eslint-disable no-useless-catch */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser, getUser } = require("../db/users");
const { getPublicRoutinesByUser } = require("../db/routines");
const bcrypt = require("bcrypt");


router.use((req,res,next) => {
    console.log("A request is being made to /users");

    next();

});
// POST /api/users/register
router.post("/register", async (req,res,next) => {
    const {username, password} = req.body 
    try {
        const _user = await getUserByUsername(username);
        console.log(_user);
        if (_user) { // If a user by that name already exists. 
       
        
            res.send({
                name: "UserAlreadyExists",
                message: "A user by that name already exists."
            });
        } else if (password.length < 8) {
            res.send({
                name: "PasswordTooShort",
                message: "Password must be a minimum of 8 characters."
            });
        } else {


        const user = await createUser({username, password});
        console.log("CreateUser data:", user)
        

        if (user.id) {
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: "1w"
            });
            res.send({
            message: "Thank you for signing up to our website!",
            token
        })};
    };
        
    } catch (error) {
        console.log("Error in catch block")
        next(error);
    }
});
// POST /api/users/login
router.post("/login", async (req,res,next) => {
    
    try {
        const { username, password } = req.body;

    if (!username || !password) { // Request body must have both a username & password.
        res.send({
            name: "Missing Credentials!",
            message: "Please supply both a username and password!"
        });
    };
        const user = await getUserByUsername(username);
        const areTheyTheSame = await bcrypt.compare(password, user.password);

        if (user && areTheyTheSame) { // If the user exists & user password matches password from the request body...
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
            });

        } else {
            res.send({
                name: "Incorrect Credentials!",
                message: "Username or password is incorrect!"
            });
        }
    } catch (error) {
        console.log("This is the catch block error");
        next(error);
    }

});

// GET /api/users/me
router.get("/me",  async (req,res,next) => {
    console.log("/me RH");
    try {

        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        
        console.log("Decrypted token:", decryptedUserToken)
        
        const user = await getUserByUsername(decryptedUserToken.username)

        console.log("User:", user)
        
        if(user.username == decryptedUserToken.username) {
            console.log("Inside if statement");
            res.send({
                id: user.id,
                username: decryptedUserToken.username
            });
        } else {
            console.log("inside else statement");
            res.send({
                name: "Invalid Token",
                message: "Please log in."
            });
        }



    } catch ({name, message}) {
        next({name, message});
    }
})

// GET /api/users/:username/routines
router.get("/:username/routines",  async (req,res,next) => {
    try {
        // console.log("Below: Headers, req.user, req.params, decryptedToken, user from getUserByUsername")
        // console.log(req.headers) // see headers
        // console.log(req.user) // undefined
        // console.log(req.params); // albert
        // console.log("This is req.params.username:", req.params.username)
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);

        // console.log(decryptedUserToken); // albert object with id, iat, exp

        const user = await getUserByUsername(req.params.username);

        console.log(user); // undefined

        if (decryptedUserToken.username && user.username == decryptedUserToken.username) {
            const userRoutines = await getPublicRoutinesByUser(user.id)
            res.send(userRoutines);
        } else {
            res.send({
                name: "User Not Valid",
                message: "Cannot get routines. User is not valid."
            });
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;