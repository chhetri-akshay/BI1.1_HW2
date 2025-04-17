const mongoose = require("mongoose")
const { initializeDatabase } = require("./db/db.connect")
const HotelList = require("./models/hotels.models");
const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
  

  async function main() {
    await initializeDatabase()

    async function createNewHotel(newHotel){
        try{
            const hotel = new HotelList(newHotel)
            const saveHotel = await hotel.save()
            return saveHotel
        } catch(error){
            throw(error)
        }
    }

    app.post("/hotels", async(req, res) => {
        try {
        const savedHotel = await createNewHotel(req.body)
        if(savedHotel){
            res.status(201).json({message: "Hotel saved successfully"})
        } else {
            res.status(404).json({message: "Hotel not found"}) 
        }
        }catch(error){
            res.status(500).json({message: "Failed to connect to server"})
        }
    })
    
    async function readAllHotel() {
        try{
            const allHotels = await HotelList.find()
            return allHotels    
        } catch(error){
            throw(error)
        }
    }
    
    app.get("/hotels", async (req, res) => {
        try {
            const allHotels = await readAllHotel()
            if(allHotels){
            res.json(allHotels)
            }else {
            res.status(404).json({error: "Hotels not found"})
            }
        } catch(error) {
            res.status(500).json({error: "An error occured while fetching hotel data."})
        }
    })
    
    async function findByName(hotelName) {
        try{
            const hotelByName = await HotelList.findOne({name: hotelName})
            return hotelByName
        } catch(error) {
            throw(error)
        }
    }
    
    app.get("/hotels/:hotelName", async(req, res) => {
        try{
            const selectedHotels = await findByName(req.params.hotelName)
            if(selectedHotels) {
                res.json(selectedHotels)
            }else {
                res.status(404).json({error: "No Hotel found."})
            }
            
        }catch(error) {
            res.status(500).json({error: "An error occured while fetching name."})
        }
    })

    async function findByNumber(number) {
        try{
            const hotelByNo = await HotelList.findOne({phoneNumber: number})
            return hotelByNo
        } 
        catch(error) {
            throw(error)
        }
    }

    app.get("/hotels/directory/:phoneNumber", async(req, res) => {
        try{
            const selectedHotels = await findByNumber(req.params.phoneNumber)
            if(selectedHotels){
            res.json(selectedHotels)
            }else {
            res.status(404).json({error: "Hotel not found."})
            }
        }catch(error) {
            res.status(500).json({error: "An error occured while fetching number"})
        }
    })

    async function findHotelsByRating(selectedRating) {
        try{
            const hotelsByRating = await HotelList.find({rating: selectedRating})
            console.log(hotelsByRating)
            return hotelsByRating
        }catch(error) {
            return(error)
        }
    }

    app.get("/hotels/rating/:hotelRating", async(req, res) => {
        try{
            const selectedHotels = await findHotelsByRating(req.params.hotelRating)
            if(selectedHotels){
            res.json(selectedHotels)
            }else {
            res.status(404).json({error: "Hotel not found."})
            }
        }catch(error) {
            res.status(500).json({error: "An error occured while fetching rating"})
        }
    })
    
    const PORT = 4050
    app.listen(PORT, () => {
        console.log(`Connected to port ${PORT}`)
    })

  }

  async function hotelsByCategory(cat) {
    try {
        const hotelByCat = await HotelList.find({category: cat})
        return hotelByCat
    } catch(error) {
        throw(error)
    }
  }

  app.get("/hotels/category/:hotelCategory", async(req, res) => {
    try{
        const selectedHotels = await hotelsByCategory(req.params.hotelCategory)
        if(selectedHotels) {
            res.json(selectedHotels)
        } else {
            res.status(404).json({error: "No hotels found"})
        }
    }catch(error) {
        res.status(404).json({error: "Unable to fetch hotel data."})
    }
  })

  async function deleteHotel(hotelId){
    const deleteHotel = await HotelList.findByIdAndDelete(hotelId)
    return deleteHotel
  }

  app.delete("/hotels/:hotelId", async (req, res) => {
    try{
        const deletedHotel = await deleteHotel(req.params.hotelId)
        if(deleteHotel){
            res.status(201).json({message: "Hotel deleted successfully."})
        } else {
            res.status(404).json({error: "Hotel Not found"})
        }
    }catch(error){
        throw(error)
    }
  })

  async function updateHotel(hotelId, dataToUpdate){
    const updateHotel = await HotelList.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
    return updateHotel
  } 

  app.post("/hotel/:hotelId", async(req, res) => {
    try{
        const updatedHotel = await updateHotel(req.params.hotelId, req.body)
        if(updateHotel){
            res.status(201).json({message: "Hotel updated successfully."}) 
        } else {
            res.status(404).json({message: "Hotel not found."})
        }
    }catch(error) {
        throw(error)
    }
  })

  main()

  