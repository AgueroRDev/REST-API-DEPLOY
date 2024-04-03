const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error:'El titulo no es String',
        required_error:'Requerido'
    }),
    year: z.number().int().min(1900).max(2024),
    director:z.string(),
    duration:z.number().int().positive(),
    rate:z.number().min(0).max(10).default(5),
    poster:z.string().url({message:'URL invalido'}),
    genre:z.array(
        z.enum([
            'Action','Adventure','Crime','Comedy','Drama','Fantasy','Horror','Thriller','Sci-Fi',
            {
                invalid_type_error:'Typo Invalido',
                required_error:'Valor Requerido'
            }
        ])
    )
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}
function valPartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}
module.exports={
    validateMovie,
    valPartialMovie
}