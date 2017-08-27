import { GraphQLString } from 'graphql';

import UserType from '../Types/User.type';

const UserCreate = {
  name: 'UserCreate',
  type: UserType,
  args: {
    displayName: { type: GraphQLString },
    userName: { type: GraphQLString }, // used to log in ... should not match display name or email address
    email: { type: GraphQLString }, // needs a data type
  },
  resolve: () => {

  }
};

export default UserCreate;
