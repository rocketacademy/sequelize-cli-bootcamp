module.exports = {
  up: async (queryInterface, Sequelize) => {
    // creates a table called categories
    // Do I need to re-specify the other tables I've built? 
    // In this example, I'm not editing the trips table
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      // created_at and updated_at are required
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // I need to add a foreign key for the attractions table
    // Would this update my attractions table? ########################
    // Would this remove my past data? #######################
    await queryInterface.addColumn('attractions', 'category_id', {
        type: Sequelize.INTEGER,
        // This links the category_id column to the id column in the categories table
        references: {
          model: 'categories',
          key: 'id',
        },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // attractions column needs to be removed first because attractions references categories 
    await queryInterface.removeColumn('attractions', 'category_id');
    await queryInterface.dropTable('categories');
  },
};

 // When tables are created via migration, i.e,. npx sequelize db:migrate, we observe the following:
 // categories table are created, data can be inserted
 // attractions table adds another cateogry_id column
 // past attractions data still present