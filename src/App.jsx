import { Outlet } from "react-router-dom"
import Navbar from "./shared/Navber"
import Footer from "./shared/Footer"


function App() {

  return (
    <>
    
    <div className="mx-2 md:mx-5">
    <Navbar/>
    <div className="container mx-auto px-4 md:px-6">
    <Outlet/>

    </div>
    <Footer/>
    </div>

    </>
  )
}

export default App
 