import sequelizePackage from 'sequelize';
// ../ is the parent of the current directory.
import allConfig from './config/config.js';
// ./ is the current directory
import initTripModel from './models/trip.mjs';
import initAttractionModel from './models/attraction.mjs';
import initCategoryModel from './models/category.mjs';


const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Trip = initTripModel(sequelize, Sequelize.DataTypes);
db.Attraction = initAttractionModel(sequelize, Sequelize.DataTypes);
db.Category = initCategoryModel(sequelize, Sequelize.DataTypes);

// The following 2 lines enable Sequelize to recognise the 1-M relationship
// between Attraction and Trip models, providing the mixin association methods.
db.Attraction.belongsTo(db.Trip);
db.Trip.hasMany(db.Attraction);

// Is this syntax correct? ######################
db.Attraction.belongsTo(db.Category);
db.Category.hasMany(db.Attraction);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// psql -d travel_itineraries_development

// To create a Trip 
if ( process.argv[2] === "create") {
  db.Trip.create({
  name: process.argv[3],
})
  .then((trip) => {
    console.log('success!');
    console.log(trip);
  })
  .catch((error) => console.log(error));
} 
// To create an Attraction (i.e., an item)
else if ( process.argv[2] === "add-attrac") {
let categoryResultId;
let latitudeValue = Number(process.argv[6]);
let longitudeValue = Number(process.argv[7]);
// find the specified category
db.Category.findOne({
  where: {
    name: process.argv[5],
  },
})
// the result is specified as "returnedCategory"
.then((returnedCategory) => {
  console.log(`${returnedCategory}`)
  categoryResultId = returnedCategory.id
})
// find the specified trip
db.Trip.findOne({
  where: {
    name: process.argv[3],
  },
})
  // the result is specified as "returnedTrip"
  .then((returnedTrip) => {
    // Docs on .create
    // https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create
    return db.Attraction.create({
      name: process.argv[4],
      tripId: returnedTrip.id,
      categoryId: categoryResultId,
      latitude: latitudeValue,
      longitude: longitudeValue,
    });
  })
  .then((returnedAttraction) => {
    console.log('success!!');
    console.log(returnedAttraction.id, 'returned attraction ID');
    console.log(returnedAttraction.tripId, `returned attraction's trip ID`);
    console.log(returnedAttraction.categoryId, `returned attraction's category ID`);
    console.log(latitudeValue, 'latitude');
    console.log(longitudeValue, 'longitude');
  })
  .catch((error) => {
    console.log(error);
  });
}
// To find itinerary of a trip (i.e., returning all items in a trip)
else if ( process.argv[2] === "trip") {
  // find the specified trip
  db.Trip.findOne({
  where: {
    name: [process.argv[3]],
  },
})
  // When we omit curly braces in arrow functions, the return keyword is implied.
  // getAttractions() is a sequelize function syntax - grabs the rows in table attractions with the tripID which matches the id of the specifed Trip 
  // Any syntax works, anything in .then(###) refers to the results
  .then((letThisBeAnything) => letThisBeAnything.getAttractions())
  // tripAttractions are the rows with the tripID which matches the id of the specifed Trip 
  .then((letThisBeAnythingToo) => {
    console.log(letThisBeAnythingToo)
    console.log(letThisBeAnythingToo.map((x) => x.name))
  })
  .catch((error) => console.log(error));
}
// To create a categories (i.e., returning all items in a trip)
else if ( process.argv[2] === "add-category") {
  db.Category.create({
    name: process.argv[3],
  })
    .then((resultCategory) => {
      console.log('success om !');
      console.log(resultCategory);
    })
    .catch((error) => console.log(error));
}
// Get All Attractions in Trip with Given Category
else if ( process.argv[2] === "category-trip") {
  let categoryResultId = 0;
  let tripResultId = 0;
  // find the specified category
  db.Category.findOne({
  where: {
    name: [process.argv[4]],
  },
})
.then((returnedCategory) => {
  categoryResultId = returnedCategory.id
  console.log(`THIS IS CATEGORY ID ${categoryResultId}`)
})
  // find the specified trip
  db.Trip.findOne({
  where: {
    name: [process.argv[3]],
  },
})
.then((returnedTrip) => {
  tripResultId = returnedTrip.id
  console.log(`THIS IS TRIP ID ${tripResultId}`)
    // find relevant Attractions
    //I had to nest this because it doesn't seem like it's executing in order ############################
    db.Attraction.findAll({
    where: {
      trip_id: [tripResultId],
      category_id: [categoryResultId]
      },
    })
    .then((letThisBeAnythingToo) => {
      console.log("DOES THIS RUN?")
      console.log(letThisBeAnythingToo.map((x) => x.name))
    })
  })
  .catch((error) => console.log(error));
}
// Get Attractions for All Trips that Belong to Specific Category
else if ( process.argv[2] === "category-attractions") {
  let categoryResultId = 0;
  // find the specified category
  db.Category.findOne({
  where: {
    name: [process.argv[3]],
  },
})
.then((returnedCategory) => {
  categoryResultId = returnedCategory.id
  console.log(`THIS IS CATEGORY ID ${categoryResultId}`)
    // find relevant Attractions
    // same issues, jad to nest because it isn't exuecuting in order ################################
    // Another point to note is that code works even though I had not made the corresponding adjustments in models (e.g., attraction.mjs where another column (category_id) is added) ##########################
      db.Attraction.findAll({
      where: {
        category_id: [categoryResultId]
        },
      })
      .then((letThisBeAnythingToo) => {
        console.log(letThisBeAnythingToo)
        console.log("DOES THIS RUN?")
        console.log(letThisBeAnythingToo.map((x) => x.name))
        })
      })
.catch((error) => console.log(error));
}
//  gets all attractions within 300 kms of a location.
else if ( process.argv[2] === "get-attractions-within") {
  let tripResultId;
  // find the specified trip
  db.Trip.findOne({
  where: {
    name: [process.argv[3]],
  },
})
.then((returnedTrip) => {
  tripResultId = returnedTrip.id
  console.log(`THIS IS Trip ID ${tripResultId}`)

      db.Attraction.findAll({
      where: {
        trip_id: [tripResultId]
        },
      })
      .then((letThisBeAnythingToo) => {
        // Need to loop through all rows and subject them to getDistanceFromLatLonInKm()
        letThisBeAnythingToo.map((x) => {
          // console.log("does this run?")
          // console.log(Number(x.latitude))
          // console.log(Number(x.longitude))
          // console.log((getDistanceFromLatLonInKm(Number(x.latitude), Number(x.longitude), Number(process.argv[4]), Number(process.argv[5]))))
          if ((getDistanceFromLatLonInKm(x.latitude, x.longitude, Number(process.argv[4]), Number(process.argv[5]))) < 300) {
            console.log(x.name)
            }
          })
        })
      })
.catch((error) => console.log(error));
}