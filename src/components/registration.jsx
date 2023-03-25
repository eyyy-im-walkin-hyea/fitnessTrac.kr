import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate()

    async function sendRegisterNewAccountReq(e) {
        e.preventDefault();
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
                alert("Username is too short! Must be over 5 characters long..");
                return;
            } else if (newPassword.length < 8) {
                alert("Password is too short! Must be over 8 characters long..");
                return;
            }
    

            const response = await fetch("postgres://localhost:5432/fitness-dev/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    user: {
                        username: newUsername,
                        password: newPassword
                    }
                })
            })
            const translatedData = await response.json();
            console.log(translatedData)
            if (!translatedData.success) {
                alert("Account was not successfully created. Please try again!")
            } else {
                const myJWT = translatedData.data.token;
                localStorage.setItem("token", myJWT)
                navigate("/")
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={sendRegisterNewAccountReq}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                />
                <input
                    type="text"
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
