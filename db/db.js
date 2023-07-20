module.exports = function (success,error) {
    const mongoose = require('mongoose')
    const config = require('../config/config')
    mongoose.connect(`mongodb://${config.DBHOST}:${config.DBPORT}/${config.DBNAME}`)
    if(typeof error !== "function"){
        error = () =>{
            console.log("連接失敗")
        }
    }
    //連接成功
    mongoose.connection.once('open', () => {
        success()
    })

    //連接失敗
    mongoose.connection.on('error', () => {
        error()
    })

    //連接關閉
    mongoose.connection.on('close', () => {
        console.log('連接關閉')
    })
}


