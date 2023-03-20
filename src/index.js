import {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Placeholder } from "./components/index";


const App = () => {
    
    
    return (
        <BrowserRouter>
            <div>
                <nav className="">
                    <Link to="/placeholder1" className="">Placeholder1</Link>
                    <Link to="/placeholder2" className="">Placeholder2</Link>
                    <Link to="/placeholder3" className="">Placeholder3</Link>
                    <Link to="/placeholder4" className="">Placeholder4</Link>
                </nav>

                <Header/>

                <Routes>
                    <Route path="/placeholder" element={<Placeholder/>}/>
                    <Route path="/placeholder" element={<Placeholder/>}/>
                    <Route path="/placeolder" element={<Placeholder/>}/>
                    <Route path="/placeholder" element={<Placeholder/>}/>
                </Routes>

                <Footer />

            </div>
        </BrowserRouter>
)};



const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App/>);