const mongoose = require('mongoose')

let BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author:{
        type: String,
        default: "匿名"
    },
    time: Date
})

let BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel