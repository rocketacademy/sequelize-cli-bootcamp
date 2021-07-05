import db from './models/index.mjs';

if (process.argv[2] === 'create') {
  db.Trip.create({
    name: process.argv[3],
  })
    .then((trip) => {
      console.log('success!');
      console.log(trip);
    })
    .catch((error) => console.log(error));
}

if (process.argv[2] === 'add-attrac') {
  
db.Trip.findOne({
  where: {
    name: process.argv[3],
  },
})
  .then((returnedTrip) => {
    // Docs on .create
    // https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create
    return db.Attraction.create({
      name: process.argv[4],
      tripId: returnedTrip.id,
    });
  })
  .then((returnedAttraction) => {
    console.log('success!!');
    console.log(returnedAttraction.id, 'returned Attraction ID');
    console.log(returnedAttraction.tripId, `returned Attraction's trip ID`);
  })
  .catch((error) => {
    console.log(error);
  });
}

if (process.argv[2] === 'trip') {
  db.Trip.findOne({
    where: {
      name: process.argv[3],
    },
  })
  .then((trip) => trip.getAttractions())
  .then((tripAttractions) => 
    console.log(tripAttractions.map((tripAttraction) => tripAttraction.name))
  )
  .catch((error) => console.log(error));
}
