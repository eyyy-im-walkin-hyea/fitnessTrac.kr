import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = `http://localhost:1337/api`

const Homepage = (props) => {
    const [myData, setMyData] = useState({})

    useEffect(() => {
        if (localStorage.getItem("token")) {
            props.setIsLoggedIn(true)
            // console.log(localStorage.getItem("token"));
            fetchMyData();
        } else {
            props.setIsLoggedIn(false)
            // console.log("No token exists!");
        }
        
        async function fetchMyData() {
            try {
                const response = await fetch(`${BASE_URL}/users/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const translatedData = await response.json(); 
                console.log(translatedData)
                setMyData(translatedData)
            } catch (e) {
                console.log(e); 
            }
        }
    }, [])

    return (
        <div className="login">
            <div>
                {
                    props.isLoggedIn ? <p className="welcome">Welcome {myData.username}! Where would you like to go?</p>
                    : <h3>Login / register above or <Link to="/posts">continue as a guest</Link> to view listings only.</h3>
                }
            </div>
            <br />
            <br />
        </div>
    )
}
export default Homepage;