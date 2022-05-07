export default function initAttractionModel(sequelize, DataTypes) {
  return sequelize.define(
    'attraction', //singular 
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      tripId: {
        type: DataTypes.INTEGER,
        // This links the tripId column to the id column in the trips table
        references: {
          model: 'trips',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      // Important to add these edits into the mjs models files. Otherwise your sequelize commands don't recognise the columns
      categoryId: {
          type: DataTypes.INTEGER,
          // This links the tripId column to the id column in the trips table
          references: {
            model: 'categories',
            key: 'id',
          },
        },
      latitude: {
        type: DataTypes.NUMERIC,
      },
      longitude: {
        type: DataTypes.NUMERIC,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      underscored: true,
    }
  );
}