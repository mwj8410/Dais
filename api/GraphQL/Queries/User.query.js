import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import UserType from '../Types/User.type';

import MongoDataSource from '../../Connections/Mongo.datasource';

// Maps id to User object
const fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

const UserQuery = new GraphQLObjectType({
  name: 'UserQuery',
  fields: {
    user: {
      type: UserType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, {id}) => {
        return fakeDatabase[id];
      }
    }
  }
});

export default UserQuery;
