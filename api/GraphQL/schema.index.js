import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

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

// Define the User type
const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }
});

// Define the Query type
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: GraphQLString }
      },
      resolve: function (_, {id}) {
        return fakeDatabase[id];
      }
    }
  }
});

let schema = new GraphQLSchema({ query: queryType });
