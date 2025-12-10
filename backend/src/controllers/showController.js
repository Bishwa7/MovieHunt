import axios from "axios"
import { movieModel } from "../models/Movie.js"
import { showModel } from "../models/Show.js"



// Api to get now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    
    try
    {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }
        )


        const movies = data.results

        res.json({
            success: true,
            movies: movies
        })

    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message
        })
    }
}





// API to add a new show to the database
export const addShow = async (req, res) => {

    try{
        const {movieId, showsInput, showPrice} = req.body

        let movie = await movieModel.findById(movieId)

        if(!movie)
        {
            // fetch movie details & credits from tmdb
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                ),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                )
            ])


            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data


            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                genres: movieApiData.genres,
                casts: movieCreditsData.casts,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }



            // adding movie to mongodb
            movie = await movieModel.create(movieDetails)
        }

        
        const showsToCreate = []

        showsInput.forEach(show => {
            const showDate = show.date

            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });


        if(showsToCreate.length > 0)
        {
            await showModel.insertMany(showsToCreate)
        }


        res.json({
            success: true,
            message: "Show added successfully"
        })

        
    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message
        })
    }
}