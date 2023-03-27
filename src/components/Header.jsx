import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

const Header = (props) => {



    return (
        <div className="header1">
            <header>
                <nav className="header-nav">
                    <button><Link to="/" id="homebtn"> Home </Link></button>
                    <br/>
                    <button><Link to="/activities" id="activitiesbtn"> Activities</Link></button>
                    <br/>
                    <button><Link to="/routines" id="routinesbtn"> Routines </Link> </button>
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