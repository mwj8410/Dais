const MongoDataSourceSchema = [
  {
    collectionName: 'User',
    indexes: [
      { name: 'id', unique: true }
    ]
  }
];

export default MongoDataSourceSchema;
