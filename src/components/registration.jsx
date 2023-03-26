import { useState } from "react";
import { useNavigate } from "react-router-dom";
const DATABASE_URL = `http://localhost:1337/api`

const Register = () => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate()

    async function sendRegisterNewAccountReq(event) {
        event.preventDefault();
        try {
            console.log("New username is " + newUsername);
            console.log("New password is " + newPassword);

            if (newUsername.length == 0) {
                alert("Please enter a username.")
                return;
            } else if (newPassword.length == 0) {
                alert("Please enter a password.")
                return;
            }
            if (newUsername.length < 5) {
                alert("Username is too short! Must be over 5 characters long.");
                return;
            } else if (newPassword.length < 8) {
                alert("Password is too short! Must be at least 8 characters long.");
                return;
            }
    

            const response = await fetch(`${DATABASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                        username: newUsername,
                        password: newPassword
                    
                })
            });
            const translatedData = await response.json();
            console.log(translatedData)
            if (!translatedData.token) {
                alert(translatedData.message)
            } else {
                alert(translatedData.message)
                const myJWT = translatedData.token;
                localStorage.setItem("token", myJWT)
                navigate("/profile");
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h2> Fill in the forms below to create an account:</h2>
            <form onSubmit={sendRegisterNewAccountReq}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default Register;
