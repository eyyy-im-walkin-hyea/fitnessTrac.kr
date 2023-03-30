import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const DATABASE_URL = `https://fitnesstrackr-zvm8.onrender.com/api`


const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        console.log(localStorage.getItem("token"));
        if (localStorage.getItem("token")) {
            props.setIsLoggedIn(true);
            console.log("New token being generated!")
        } else {
            props.setIsLoggedIn(false);
            console.log("No token exists!");
        }
    }, [props.isLoggedIn]); 

    async function sendLoginReq(e) {
        e.preventDefault();
        try {
            console.log("Username is " + username);
            console.log("Password is " + password);

            if (username.length == 0) {
                alert("Please enter a username.")
                return;
            } else if (password.length == 0) {
                alert("Please enter a password.")
                return;
            }

            const response = await fetch(`${DATABASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                        username: username,
                        password: password
                    
                })
            });
            const translatedData = await response.json();
            console.log(translatedData)
            if (!translatedData.message) {
                alert("Login failed. Please try again!")
            } else {
                const myJWT = translatedData.token;
                localStorage.setItem("token", myJWT)
                
                navigate("/myRoutines");
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="login">
            <br />
            <form onSubmit={sendLoginReq}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;
