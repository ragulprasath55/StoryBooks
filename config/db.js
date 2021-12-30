const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,//to avoid some errors in console
            useUnifiedTopology : true
        })

        console.log(`Mango db connected : ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB