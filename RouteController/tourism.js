const {Router}=require('express')
const {tourModel}= require('../models/tourismModel')


const tourismRouter=Router()



tourismRouter.get('/', async (req, res) => {
    const {Continent, CountryName } = req.query; // Get the CountryName query parameter
    
    try {
      let data;
  
      if (CountryName && Continent) {
        console.log(CountryName)
        data = await tourModel.find({"Continent":Continent,"countries.CountryName":CountryName},{"countries.$":1})

      } else {
        data = await tourModel.find(req.query);
      }
  
      console.log(data);
      res.send({ mssg: "Data retrieved successfully", data: data });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while fetching data" });
    }
  });
  

module.exports={tourismRouter}