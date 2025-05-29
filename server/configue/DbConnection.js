const mongoose = require('mongoose');

const DbConnection = async () => {
 
    try{
        console.log(process.env.MONGO_URL)
         const connect = await mongoose.connect(process.env.MONGO_URL)
         console.log(`Database connected successfully....`);
        }catch(error){
            console.log(`Error in Database conecting..`, error);
    }


}

module.exports = DbConnection;