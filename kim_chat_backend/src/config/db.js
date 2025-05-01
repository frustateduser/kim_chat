let mongoose = require('mongoose');

let connectDataBase = async () => {
    try {
        await mongoose.connect(process.env.database_url_local);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDataBase;