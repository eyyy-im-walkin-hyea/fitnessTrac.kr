import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

const Header = (props) => {



    return (
        <div>
            <header id="headerFlex">
                <nav id="navFlex">
                    <Link to="/" id="home"> Home </Link>
                    <ul>
                        <li>
                                {
                                    props.isLoggedIn ? <li><Link to="/myRoutines"> My Routines </Link></li> : <li><Link to="/reg"> Create Account </Link></li>
                                }
                                {
                                    props.isLoggedIn ? <li><Link to="/logout"
                                        onClick={(() =>
                                            localStorage.removeItem("token")
                                        )}
                                    > Logout </Link></li> : <li><Link to="/login"> Login </Link></li>
                                }
                        </li>
                    </ul>


                </nav>
                <h1> Stranger's Things & Stuff </h1>
            </header>

        </div>
    )
}

export default Header;