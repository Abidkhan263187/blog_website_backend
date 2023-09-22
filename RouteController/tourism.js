const { Router } = require('express');
const { tourModel } = require('../models/tourismModel');

const tourismRouter = Router();

tourismRouter.get('/', async (req, res) => {
  const { Continent, CountryName, StateName } = req.query;

  try {
    let data;

    if (CountryName && StateName && Continent) {
      data = await tourModel.aggregate([
        {
          $match: {
            "Continent": Continent,
            "countries.CountryName": CountryName,
            "countries.states.StateName": StateName
          }
        },
        {
          $project: {
            _id: 0,
            state: {
              $filter: {
                input: {
                  $map: {
                    input: "$countries",
                    as: "country",
                    in: {
                      $filter: {
                        input: "$$country.states",
                        as: "state",
                        cond: { $eq: ["$$state.StateName", StateName] }
                      }
                    }
                  }
                },
                as: "states",
                cond: { $ne: ["$$states", []] }
              }
            }
          }
        }
      ]);

    }
    else if (CountryName && Continent) {
      data = await tourModel.find({
        "Continent": Continent,
        "countries.CountryName": CountryName
      }, {
        "countries.$": 1
      });
    }
    else {
      data = await tourModel.find(req.query);
    }

    // console.log(data);
    res.send({ mssg: "Data retrieved successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching data" });
  }
});

module.exports = { tourismRouter };
