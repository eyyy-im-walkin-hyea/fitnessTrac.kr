import {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Activities, Homepage, Login, MyRoutines, Registration, Routines, Logout } from "./components/index";
import { useState, useEffect } from "react";
const DATABASE_URL = `http://localhost:1337/api`

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
            <div>
                <nav className="">
                    {/* <Link to="/placeholder" className="">Placeholder1</Link> */}

                </nav>

                {/* <Header/> */}

                <Routes>
                    <Route path="/" element={<Homepage />}/>
                    <Route path="/activities" element={<Activities isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData} />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/profile" element={<MyRoutines isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData}/>}/>
                    <Route path="/register" element={<Registration />}/>
                    <Route path="/routines" element={<Routines isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} setUserData={setUserData}/>}/>
                    <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                </Routes>

                {/* <Footer /> */}

            </div>
        </BrowserRouter>
)};



const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App/>);