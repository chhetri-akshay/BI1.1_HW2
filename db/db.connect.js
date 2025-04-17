const mongoose = require("mongoose")

require("dotenv").config()
const mongoUrl = process.env.MONGODB

const initializeDatabase = async() => {
    await mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("Connected to the Database.")
    })
    .catch((error) => {
        throw(error)
    })
}

module.exports = {initializeDatabase}