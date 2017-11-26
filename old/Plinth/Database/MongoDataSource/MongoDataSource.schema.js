const MongoDataSourceSchema = [
  {
    collectionName: 'User',
    indexes: [
      { name: 'id', unique: true }
    ]
  }
];

module.exports = MongoDataSourceSchema;
