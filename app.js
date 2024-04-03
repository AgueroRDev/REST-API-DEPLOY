const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, valPartialMovie } = require('./schemas/movies')


const app = express()
app.use(express.json())

app.disable('x-powered-by')

const ACEEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://localhost:1234',
    'http://movies.com',
    ''
]

app.get('/',(req,res)=>{
    res.json({
        Curso:'Base de Gatos ',
        Profesor:'Pastor'
    })
})
app.get('/movies',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
    }
    const {genre} = req.query
    if (genre) {
        const filterMov = movies.filter(
            movie => movie.genre.some(g=>g.toLocaleLowerCase()===genre.toLocaleLowerCase())
        ) 
        return res.json(filterMov)
    }
    res.json(movies)

})

app.get('/movies/:id',(req,res)=>{
    const { id } = req.params
    const movie = movies.find(movie =>movie.id === id)
    if(movie){
        return res.json(movie)
    }

    res.status(404).json({
        messaje:'Pelicula no Encontrada'
    })
})
app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)
    if (result.error) {
        res.status(402).json({
            error:JSON.parse(result.error.message)
        })
    }

    // const {
    //     title,
    //     genre,
    //     director,
    //     year,           metodo sin validacion //
    //     duration,
    //     rate,
    //     poster
    // } = req.body

    const newMovie ={
        id : crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)

    res.status(201).json(newMovie)
    
})

app.patch('/movies/:id',(req,res)=>{
    const result = valPartialMovie(req.body)
    if (!result.success) {
        return res.status(404).json({
            error: JSON.parse(result.error.message)
        })
    }
    const {id} = req.params
    const movieIndex = movies.findIndex(movie =>movie.id === id)
    if (movieIndex ===-1) {
        return res.status(404).json({
            message:"Movie Not Found"
        })
    }
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex]=updateMovie
    return res.json(updateMovie)
})

app.delete('/movies/:id',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
    }
    
    const {id} = req.params
    const movieIndex = movies.findIndex(movie =>movie.id=== id)
    if (movieIndex === -1) {
        return res.status(404).json({
            message:'Movie not Found'
        })
    }
    movies.splice(movieIndex,1)

    return res.json({
        messaje:'Movie Deleted'
    })
})

app.options('/movies/:id',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
        res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE')
    }
    res.send(200)
})


const PORT = process.env.PORT ?? 1234

app.listen(PORT,()=>{
    console.log(`Excuchando en http://localhost:${PORT}/`);
})
