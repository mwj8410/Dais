import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import DateTime from './Primitives/DateTime.type';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString }, // make UUID
    name: { type: GraphQLString }, // rem

    displayName: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    userName: { type: GraphQLString }, // used to log in ... should not match display name or email address

    email: { type: GraphQLString }, // needs a data type

    // Need to figure out what to do with ...
    // address
    // phone numbers

    createdAt: { type: GraphQLString }, // Needs to be a date
    updatedAt: { type: GraphQLString } // Needs to be a date
  }
});

export default UserType;
