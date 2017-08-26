import {
  GraphQLSchema,
} from 'graphql';

import UserQuery from './Queries/Query.index';

let schema = new GraphQLSchema({ query: UserQuery });

export default schema;
