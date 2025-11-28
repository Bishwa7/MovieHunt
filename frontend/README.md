# Frontend Steps - 


## Step 1 - 

```
npm create vite@latest

// Project Name -> frontend

-> React

-> JavaScript
```


```
cd frontend

npm install react-router-dom

npm install lucide-react

npm install react-hot-toast 

npm install react-player
```

<br/>


main.jsx
```javascript
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
```

<br/>


App.jsx
```javascript
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

function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/movies" element={ <Movies /> } />
        <Route path="/movies/:id" element={ <MovieDetails /> } />
        <Route path="/movies/:id/:date" element={ <SeatLayout /> } />
        <Route path="/my-bookings" element={ <MyBookings /> } />
        <Route path="/favourite" element={ <Favourite /> } />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
```

<br/><br/>


## Step 2 - 
- added TailwindCSS using vite [Installating TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)
- added custom colors and font on /src/index.css
- Created Navbar.jsx Component (src/components/Navbar.jsx)


/src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
@import "tailwindcss";


@theme{
    --color-primary: #F84565 ;
    --color-primary-dull: #D63854 ;
}


*{
    font-family: "Outfit", sans-serif;
    scrollbar-width: thin;
    scrollbar-color: #787777 #1e1e1e;
}


body{
    color: white;
    background-color: #09090B;
}
```

<br/>

src/components/Navbar.jsx

```javascript
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react';



const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">

            
            <div>
                <Link to='/' className='max-md:flex-1 flex items-center font-bold text-3xl'>
                    <img src={assets.logo} alt="" className='w-10 h-auto' />
                    MovieHunt
                </Link>
            </div>
            

            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
            max-md:text-lg z-50 flex flex-col md:flex-row items-center
            max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
            min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
            border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> {setIsOpen(!isOpen)}} />

                <Link onClick={()=>{scrollTo(0,0), setIsOpen(false)}} to='/'>Home</Link>
                <Link onClick={()=>{scrollTo(0,0), setIsOpen(false)}} to='/movies'>Movies</Link>
                <Link onClick={()=>{scrollTo(0,0), setIsOpen(false)}} to='/'>Theaters</Link>
                <Link onClick={()=>{scrollTo(0,0), setIsOpen(false)}} to='/'>Releases</Link>
                <Link onClick={()=>{scrollTo(0,0), setIsOpen(false)}} to='/favourite'>Favourites</Link>
            </div>


            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                <button className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
                    Login
                </button>
            </div>

            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=>{setIsOpen(!isOpen)}} />
        </div>
    )
}


export default Navbar;
```


<br/><br/>


## Step 3 -
- added Signup/Login & UserButton functionality in Navbar using [Clerk](https://clerk.com/)

<br/>

```
npm install @clerk/clerk-react
```

.env.example
```
VITE_CLERK_PUBLISHABLE_KEY=YourClerkPublishableKey
```


<br/>

main.jsx
```javascript
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

try{
  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }
}
catch(err)
{
  console.error(err)
}
  

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>,
)
```


<br/>

components/Navbar.jsx

```javascript
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useState } from 'react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';



const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const {user} = useUser()
    const {openSignIn} = useClerk()

    const navigate = useNavigate()

    return (
        <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">

            
            <div>
                <Link to='/' className='max-md:flex-1 flex items-center font-bold text-3xl'>
                    <img src={assets.logo} alt="" className='w-10 h-auto' />
                    MovieHunt
                </Link>
            </div>
            


            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
            max-md:text-lg z-50 flex flex-col md:flex-row items-center
            max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
            min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
            border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> {setIsOpen(!isOpen)}} />

                <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
                <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</Link>
                <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/'>Theaters</Link>
                <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/'>Releases</Link>
                <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/favourite'>Favourites</Link>
            </div>



            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user? (
                        <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
                            Login
                        </button>
                    ) : ( 
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15} />} onClick={()=> {navigate('/my-bookings')}} />
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }
                
            </div>

            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=>{setIsOpen(!isOpen)}} />
        </div>
    )
}


export default Navbar;
```


<br/><br/>


## Step 4 - 
- added HeroSection.jsx 
- added FeaturedSection.jsx
- added TrailersSection.jsx
- Footer.jsx completed
- adding HeroSection.jsx, FeaturedSection.jsx, TrailersSection.jsx on pages/Home.jsx


<br/>

- **added HeroSection.jsx in pages/Home.jsx**

components/HeroSection.jsx
```javascript
import { assets } from "../assets/assets"
import {ArrowRight, CalendarIcon, ClockIcon} from 'lucide-react'
import {useNavigate} from 'react-router-dom'

const HeroSection = () => {

    const navigate = useNavigate()

    return (
        <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36
        bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>

            <img src={assets.marvelLogo} alt="marvel logo" className="max-h-11 lg:h-11 mt-20" />

            <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
                Gaurdians <br/> of the Galaxy
            </h1>

            <div className='flex items-center gap-4 text-gray-300'>
                <span>Action | Adventure | Sci-Fi</span>
                <div className="flex items-center gap-1">
                    <CalendarIcon className='w-4.5 h-4.5' /> 2025
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon className='w-4.5 h-4.5' /> 2h 8m
                </div>
            </div>

            <p className='max-w-md text-gray-300'>A bunch of skilled criminals led by brash adventurer
                 Peter Quill join hands to fight a villain named Ronan the Accuser who wants to control the universe
                 with the help of a mystical orb.
            </p>

            <button onClick={()=> {navigate("/movies")}} className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull
            transition rounded-full font-medium cursor-pointer">
                Explore Movies
                <ArrowRight className="w-5 h-5" />
            </button>

        </div>
    )
}


export default HeroSection
```

<br/>


- **added FeaturedSection.jsx in pages/Home.jsx**


components/FeaturedSection.jsx

```javascript
import {ArrowRight} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import BlurCircle from './BlurCircle'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'

const FeaturedSection = () => {

    const navigate = useNavigate()

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            
            <div className='relative flex items-center justify-between pt-20 pb-10'>

                <BlurCircle top='0' right='-80px' />
                <p className='text-gray-300 font-medium text-lg'>Now Showing</p>

                <button onClick={() => {navigate('/movies')}} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                    View All
                    <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
                </button>
            </div>

            <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
                {dummyShowsData.slice(0,8).map((show)=>(
                    <MovieCard key={show._id} movie={show} />
                ))}
            </div>

            <div className='flex justify-center mt-20'>
                <button onClick={()=>{navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>
                    Show More
                </button>
            </div>

        </div>
    )
}


export default FeaturedSection
```


components/MovieCard.jsx

```javascript
import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/TimeFormat'


const MovieCard = ({movie}) => {

    const navigate = useNavigate()

    return (
        <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>
            
            <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0) }} src={movie.backdrop_path} alt="Movie Image" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />
            
            <p className='font-semibold mt-2 truncate'>{movie.title}</p>

            <p className='text-sm text-gray-400 mt-2'>
                {new Date(movie.release_date).getFullYear()} - 
                {movie.genres.slice(0,2).map(genre=> genre.name).join(" ")} - 
                {timeFormat(movie.runtime)}
            </p>

            <div className='flex items-center justify-between mt-4 pb-3'>
                <button onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0) }} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
                    Buy Tickets
                </button>

                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>


        </div>
    )
}


export default MovieCard
```



components/BlurCircle.jsx

```javascript
const BlurCircle = ({top = "auto", left = "auto", right = "auto", bottom = "auto"}) => {

    return (
        <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" 
        style={{top: top, left: left, right: right, bottom: bottom}} >

        </div>
    )
}

export default BlurCircle
```


lib/timeFormat.js

```javascript
const timeFormat = (minutes) => {

    const hours = Math.floor(minutes/60)

    const minutesRemainder = minutes%60


    return ` ${hours}h ${minutesRemainder}m`
}

export default timeFormat
```

<br/>

- **added TrailersSection.jsx in pages/Home.jsx**

components/TrailersSection.jsx

```javascript
import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import {PlayCircleIcon} from 'lucide-react'


const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

    console.log(currentTrailer.videoUrl)

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            
            <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>
                Trailers
            </p>


            <div className='relative mt-6'>
                <BlurCircle top='-100px' right='-100px' />

                <ReactPlayer src={currentTrailer.videoUrl} controls={false} className='mx-auto max-w-full' width="960px" height="540px" />
            </div>


            <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>

                {dummyTrailers.map((trailer)=> (
                    <div key={trailer.image} className='relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer' onClick={()=>{setCurrentTrailer(trailer)}}>

                        <img src={trailer.image} alt="trailer" className='rounded-lg w-full h-full object-cover brightness-75' />
                        <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2' />

                    </div>
                ))}

            </div>


        </div>
    )
}


export default TrailersSection
```

<br/>


- **Footer.jsx completed**


components/Footer.jsx

```javascript
import React from 'react'
import { assets } from '../assets/assets';


const Footer = () => {

    return (
        <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <div className='flex items-center font-bold text-3xl'>
                        <img alt="logo" class="h-11" src={assets.logo} />
                        MovieHunt
                    </div>
                    
                    <p className="mt-6 text-sm">
                        Ticket Booking App, a personal project, made with MERN stack
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-9 w-auto" />
                        <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p><a href="https://bishwa7.github.io/Bishwanath/" target='_blank'> My WebSite </a></p>
                            <p><a href="https://www.linkedin.com/in/bishwanathpaul/" target='_blank'> LinkedIn </a></p>
                            <p><a href="mailto:bishwa244@gmail.com" target='_blank'>bishwa244@gmail.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © <a href="https://bishwa7.github.io/Bishwanath/" target='_blank' style={{color: "#F84565"}}>Bishwanath Paul</a>. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer;
```


<br/>


- **adding HeroSection.jsx, FeaturedSection.jsx, TrailersSection.jsx on pages/Home.jsx**

Home.jsx

```javascript
import FeaturedSection from "../components/FeaturedSection";
import HeroSection from "../components/HeroSection";
import TrailersSection from "../components/TrailersSection";

const Home = () => {

    return (
        <>
            <HeroSection />
            <FeaturedSection />
            <TrailersSection />
        </>
    )
}

export default Home;
```

<br/><br/>


## Step 5 -
- added Movies.jsx page
- added MovieDetails.jsx page & DateSelect.jsx component
- added Loading.jsx component
- updated index.css

<br/>

- *added Movies.jsx page*

pages/Movies.jsx

```javascript
import React from "react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";

const Movies = () => {

    return dummyShowsData.length > 0 ? (
        
        <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">

            <BlurCircle top="150px" left="0px" />
            <BlurCircle bottom="50px" right="50px" />

            <h1 className="text-lg font-medium my-4">Now Showing</h1>

            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {dummyShowsData.map((movie)=>(
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>

        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
        </div>
    )
}

export default Movies;
```

<br/>


- *added MovieDetails.jsx page & DateSelect.jsx component*


pages/MovieDetails.jsx

```javascript
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/TimeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";




const MovieDetails = () => {

    const navigate = useNavigate()

    const {id} = useParams()
    const [show, setShow] = useState(null)

    const getShow = async () => {

        const show = dummyShowsData.find((show) => show._id === id)

        if(show)
        {
            setShow({
                movie: show,
                dateTime: dummyDateTimeData
            })
        }
        
    }


    useEffect(() => {
        getShow()
    },[id])


    return  show ? (
        <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

                <img src={show.movie.poster_path} alt="IMG" className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover" />

                <div className="relative flex flex-col gap-3">

                    <BlurCircle top="-100px" left="-100px" />

                    <p className="text-primary"> ENGLISH </p>

                    <h1 className="text-4xl font-semibold max-w-96 text-balance"> {show.movie.title} </h1>

                    <div className="flex items-center gap-2 text-gray-300">

                        <StarIcon className="w-5 h-5 text-primary fill-primary" />

                        {show.movie.vote_average.toFixed(1)} User Rating

                    </div>

                    <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl"> {show.movie.overview} </p>

                    <p> {timeFormat(show.movie.runtime)} | {show.movie.genres.map(genre => genre.name).join(", ")} | {show.movie.release_date.split("-")[0]} </p>

                    <div className="flex items-center flex-wrap gap-4 mt-4">

                        <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
                            <PlayCircleIcon className="w-5 h-5" />
                            Watch Trailer
                        </button>

                        <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull tansition rounded-md font-medium cursor-pointer active:scale-95">
                            Buy Tickets
                        </a>

                        <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </div>


            <div>
                <p className="text-lg font-medium mt-20">Your Favourite Cast</p>

                <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
                    <div className="flex items-center gap-4 w-max px-4">
                        {show.movie.casts.slice(0,12).map((cast,index)=> (
                            <div key={index} className="flex flex-col items-center text-center">
                                <img src={cast.profile_path} className="rounded-full h-20 md:h-20 aspect-square object-cover" />
                                <p className="font-medium text-xs mt-3">{cast.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>





            <div>
                <p className="text-lg font-medium mt-30">Book Tickets</p>

                <DateSelect dateTime={show.dateTime} id={id} />
            </div>



            <div>
                <p className="text-lg font-medium mt-30 mb-8">You May Also Like</p>

                <div className="flex flex-wrap max-sm:justify-center gap-8">

                    {dummyShowsData.slice(0,4).map((movie, index)=>(
                        <MovieCard key={index} movie={movie} />
                    ))}
                </div>

                <div className="flex justify-center mt-20">
                    <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">
                        Show More
                    </button>
                </div>
            </div>


            
        </div>
    ) : (
        <Loading />
    )
}


export default MovieDetails;
```


components/DateSelect.jsx

```javascript
import React, { useState } from "react"
import BlurCircle from "./BlurCircle"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


const DateSelect = ({dateTime, id}) => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)

    const onBookHandler = () => {
        if(!selected){
            return toast('Please select a Date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0)
    }

    
    return (
        <div id="dateSelect" className="pt-8">

            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="100px" right="0px" />

                <div>
                    <p className="text-lg font-semibold">Choose Date</p>
                    <div className="flex items-center gap-6 text-sm mt-5">
                        <ChevronLeftIcon width={28} />
                        <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                            {Object.keys(dateTime).map((date) => (
                                <button onClick={() => {setSelected(date)}} key={date} className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-white" : "border border-primary/70"}`}>
                                    <span>{new Date(date).getDate()}</span>
                                    <span>{new Date().toLocaleDateString("en-US", {month:"short"})}</span>
                                </button>
                            ) )}
                        </span>
                        <ChevronRightIcon width={28} />
                    </div>
                </div>


                <button onClick={onBookHandler} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer active:scale-95">Book Now</button>

            </div>
        </div>
    )
}

export default DateSelect
```

<br/>


- *added Loading.jsx component*

components/Loading.jsx

```javascript
import React from "react";


const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[80vh]">

            <div className="animate-spin rounded-full h-20 w-20 border-3 border-t-primary">
            </div>

        </div>
    )
}

export default Loading
```

<br/>


- *updated index.css*

src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
@import "tailwindcss";


@theme{
    --color-primary: #F84565 ;
    --color-primary-dull: #D63854 ;
}


html {
  scroll-behavior: smooth;
  scroll-padding-top: 130px;
}


*{
    font-family: "Outfit", sans-serif;
    scrollbar-width: thin;
    scrollbar-color: #787777 #1e1e1e;
}


body{
    color: white;
    background-color: #09090B;
}

.no-scrollbar{
    scrollbar-width: none;
}
```



<br/><br/>




### Step 6 - 
- created SeatLayout.jsx page
- added lib/isoTimeFormat.js

<br/>

- *added lib/isoTimeFormat.js*

isoTimeFormat.js

```javascript
const isoTimeFormat = (dateTime) => {

    const date = new Date(dateTime)


    const localTime = date.toLocaleTimeString('en-US', {
        hour:"2-digit",
        minute: "2-digit",
        hour12: true
    })

    return localTime
}


export default isoTimeFormat
```

<br/>



- *created SeatLayout.jsx page*

pages/SeatLayout.jsx

```javascript
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";



const SeatLayout = () => {

    const groupRows = [["A","B"], ["C","D"], ["E","F"], ["G","H"], ["I","J"]]

    const {id, date} = useParams()

    const [selectedSeats, setSelectedSeats] = useState([])
    const [selectedTime, setSelectedTime] = useState(null)
    const [show, setShow] = useState(null)

    const navigate = useNavigate()


    const getShow = async () => {
        const show = dummyShowsData.find(show => show._id === id)

        if(show)
        {
            setShow({
                movie: show,
                dateTime: dummyDateTimeData
            })
        }
    }



    const handleSeatClick = (seatId) => {

        if(!selectedTime){
            return toast("Please select time first")
        }

        if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
            return toast("You can only select 5 seats")
        }

        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
    }



    const renderSeats = (row, count = 9) => (

        <div key={row} className="flex gap-2 mt-2">

            <div className="flex flex-wrap items-center justify-center gap-2">

                {Array.from({length : count}, (_, i) => {
                    const seatId = `${row}${i+1}`

                    return (
                        <button key={seatId} onClick={() => {handleSeatClick(seatId)}} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary text-white"}`}>
                            {seatId}
                        </button>
                    )
                })}

            </div>
        </div>
    )



    const proceedToCheckout = () => {

        if (selectedSeats.length === 0) {
            return toast("Please select at least 1 seat");
        }
        navigate("/my-bookings")
        scrollTo(0, 0)
    }



    useEffect(() => {
        getShow()
    }, [])



    return show ? (
        <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
            {/* Available Timings */}

            <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
                
                <p className="text-lg font-semibold px-6"> Available Timings </p>

                <div className="mt-5 space-y-1">

                    {show.dateTime[date].map((item)=> (

                        <div key={item.time} onClick={() => {setSelectedTime(item)}} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
                            <ClockIcon className="w-4 h-4" />

                            <p className="text-sm">{isoTimeFormat(item.time)}</p>
                        </div>

                    ))}

                </div>
            </div>


            {/* Seats Layout */}

            <div className="relative flex-1 flex flex-col items-center max-md:mt-16">

                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="0px" right="0px" />

                <h1 className="text-2xl font-semibold mb-4">Select Your Seat</h1>

                <img src={assets.screenImage} alt="Screen IMG" />

                <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

                <div className="flex flex-col items-center mt-10 text-sm text-gray-300">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
                        {groupRows[0].map(row => renderSeats(row))}
                    </div>

                    <div className="grid grid-cols-2 gap-11">
                        {groupRows.slice(1).map((group, idx) => (
                            <div key={idx}>
                                {group.map(row => renderSeats(row))}
                            </div>
                        ))}
                    </div>
                </div>


                <button onClick={proceedToCheckout} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95">
                    Proceed to Checkout
                    <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
                </button>

                

            </div>

        </div>
    ) : (
        <Loading />
    )
}

export default SeatLayout;
```



<br/><br/>



