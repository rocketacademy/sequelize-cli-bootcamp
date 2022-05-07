module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Would this update my attractions table? ######################## YES
    // Would this remove my past data? ################### NO
    await queryInterface.addColumn('attractions', 'latitude', {
        type: Sequelize.NUMERIC,
    });

    await queryInterface.addColumn('attractions', 'longitude', {
        type: Sequelize.NUMERIC,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('attractions', 'latitude');
    await queryInterface.removeColumn('attractions', 'longitude');
  },
};

 // When tables are created via migration, i.e,. npx sequelize db:migrate, we observe the following:
 // categories table are created, data can be inserted
 // attractions table adds another cateogry_id column
 // past attractions data still present