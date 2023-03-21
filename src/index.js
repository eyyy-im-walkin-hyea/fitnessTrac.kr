import {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Placeholder } from "./components/index";


const App = () => {
    
    
    return (
        <BrowserRouter>
            <div>
                <nav className="">
                    <Link to="/placeholder" className="">Placeholder1</Link>

                </nav>

                <Header/>

                <Routes>
                    <Route path="/placeholder" element={<Placeholder/>}/>
                </Routes>

                <Footer />

            </div>
        </BrowserRouter>
)};



const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App/>);