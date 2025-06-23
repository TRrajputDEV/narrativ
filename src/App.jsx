import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice"
import { set } from "react-hook-form";
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  // conditional rendering....
  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between ">
      <div className="w-full block">
        <Header />
        <main>
          {/* <Outlet /> */}
        </main>
        <Footer />
      </div>

    </div>)
    : null
}

export default App
