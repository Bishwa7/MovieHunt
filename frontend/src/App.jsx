import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Favourite from './pages/Favourite'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'
import Layout from "./pages/admin/Layout"
import Dashboard from "./pages/admin/Dashboard"
import AddShows from "./pages/admin/AddShows"
import ListShows from "./pages/admin/ListShows"
import ListBookings from "./pages/admin/ListBookings"
import Auth from "./pages/Auth"
import AdminAuth from "./pages/admin/AdminAuth"
import AdminProtected from "./pages/admin/AdminProtected"



function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const isAuthRoute = useLocation().pathname.startsWith('/auth')
  
  return (
    <>
      <Toaster />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/movies" element={ <Movies /> } />
        <Route path="/movies/:id" element={ <MovieDetails /> } />
        <Route path="/movies/:id/:date" element={ <SeatLayout /> } />
        <Route path="/my-bookings" element={ <MyBookings /> } />
        <Route path="/favourite" element={ <Favourite /> } />
        <Route path="/auth" element={<Auth />} />


        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/*" element={ <Layout /> }>
          <Route element={<AdminProtected />}>
            <Route index element={ <Dashboard /> } />
            <Route path="add-shows" element={ <AddShows /> } />
            <Route path="list-shows" element={ <ListShows /> } />
            <Route path="list-bookings" element={ <ListBookings /> } />
          </Route>
        </Route>

      </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  )
}

export default App
