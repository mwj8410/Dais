import { GraphQLObjectType } from 'graphql';

import UserQuery from './User.query';

export default UserQuery;


// export default new GraphQLObjectType({
//   name: 'Query',
//   fields: () => ({
//     // viewer: {
//     //   type: User,
//     //   resolve: (source, args, {authToken}) => ({
//     //     id: toGlobalId('User', authToken.sub)
//     //   })
//     // },
//     UserQuery
//   })
// });
