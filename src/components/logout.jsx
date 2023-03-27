import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = (props) => {
    const navigate = useNavigate();

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

    async function logOut(e) {
        e.preventDefault();
        try {
            if (props.isLoggedIn === true) {
                localStorage.removeItem("token");
                props.setIsLoggedIn(false);
                navigate("/");
                // document.location.reload
            } else {
                props.setIsLoggedIn(false);
                console.log("No token exists!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>You have succesfully logged out!</h1>
            <h2>Please visit 'Home' so see all posts or 'Account' to login again.</h2>
        </div>
    );
};

export default Logout;
