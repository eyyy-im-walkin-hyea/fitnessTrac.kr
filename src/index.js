import {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Activities, Homepage, Login, MyRoutines, Registration, Routines, Logout } from "./components/index";


const App = () => {
    
    
    return (
        <BrowserRouter>
            <div>
                <nav className="">
                    {/* <Link to="/placeholder" className="">Placeholder1</Link> */}

                </nav>

                {/* <Header/> */}

                <Routes>
                    <Route path="/" element={<Homepage />}/>
                    <Route path="/activities" element={<Activities />}/>
                    <Route path="/login" element={<Login />}/>
                    {/* <Route path="/myroutines" element={<MyRoutines />}/> */}
                    <Route path="/register" element={<Registration />}/>
                    <Route path="/routines" element={<Routines />}/>
                    <Route path="/logout" element={<Logout />}/>
                </Routes>

                {/* <Footer /> */}

            </div>
        </BrowserRouter>
)};



const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App/>);