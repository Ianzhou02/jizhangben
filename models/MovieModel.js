const mongoose = require('mongoose')
const MovieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    director:{
        type: String,
        default:"匿名者",
    },
    year:{
        type:Number,
        required: true
    }
})
const MovieModel = mongoose.model('movies',MovieSchema)
module.exports = MovieModel