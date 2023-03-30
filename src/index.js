import {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Activities, Homepage, Login, MyRoutines, Registration, Routines, Logout, ActWithRoutine } from "./components/index";
import { useState, useEffect } from "react";
import Header from "./components/Header";
const DATABASE_URL = `https://fitnesstrackr-zvm8.onrender.com/api`

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true)
            getUserData()
        } else {
            setIsLoggedIn(false)
            console.log("No Token!")
        }
    }, [])
    
    const getUserData = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
          });
          const translatedData = await response.json();
          console.log(translatedData);
          if (translatedData.id > 0) {
            setUserData(translatedData);
          } else {
            console.log("Error with getUserData function");
          }
        } catch (err) {
          console.error(err);
        }
      }


    return (
        <BrowserRouter>
            <div className="br">
                <nav className="br-nav">
                </nav>

                {/* <Header/> */}
                <header className="br-header">
                    <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
                </header>
                <Routes>
                    <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}/>
                    <Route path="/activities" element={<Activities isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData} />}/>
                    <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/myRoutines" element={<MyRoutines isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData}/>}/>
                    <Route path="/register" element={<Registration isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/routines" element={<Routines isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData}/>}/>
                    <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/activities/:activityId/routines" element={<ActWithRoutine isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData}/>}/>
                </Routes>

                {/* <Footer /> */}

            </div>
        </BrowserRouter>
)};



const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App/>);