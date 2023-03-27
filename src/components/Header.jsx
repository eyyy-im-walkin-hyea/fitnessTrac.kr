import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

const Header = (props) => {



    return (
        <div>
            <header id="headerFlex">
                <nav id="navFlex">
                    <button><Link to="/" id="home"> Home </Link></button>
                    <br/>
                    <button><Link to="/activities" id="activities"> Activities</Link></button>
                    <br/>
                    <button><Link to="/routines" id="routines"> Routines </Link> </button>
                    <br/>
                                {
                                    props.isLoggedIn ? <button><Link to="/myRoutines"> My Routines </Link></button> : <button><Link to="/register"> Create Account </Link></button>
                                }
                                {
                                    props.isLoggedIn ? <button><Link to="/logout"
                                        onClick={(() =>
                                            localStorage.removeItem("token")
                                        )}
                                    > Logout </Link></button> : <button><Link to="/login"> Login </Link></button>
                                }

                </nav>
                <h1> Fitness Trac.kr </h1>
            </header>

        </div>
    )
}

export default Header;