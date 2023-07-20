const mongoose = require('mongoose')
let AccountSchema = new mongoose.Schema({
    title:{
        type:String
    },
    time:Date,
    type:{
        type:Number,
        default:-1
    },
    amount:{
        type:Number,
        required:true
    },
    remark:{
        type:String
    }
})
let AccountModel = mongoose.model('accounts',AccountSchema)
module.exports = AccountModel