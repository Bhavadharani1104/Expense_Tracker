const mongoose = require('mongoose') 
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Server Runnning On ${mongoose.connection.host}`.bgCyan.white);
    }catch(error){
        console.log(`${error}`.bgRed)
    }
}

module.exports = connectDb;