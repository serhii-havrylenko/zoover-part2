import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';

import { getAccomodations, getAccomodation, getTraveledWith, getReviews } from './data.js';

const reviewType = new GraphQLObjectType({
  name: 'Review',
  description: 'Accomodation review',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the accomodation.',
    },
    traveledWith: {
      type: new GraphQLNonNull(GraphQLString),
      dexcription: 'Traveled with'
    }
  })
});

const accommodationType = new GraphQLObjectType({
  name: 'Accomodation',
  description: 'Accomodation info with statistic and reviews',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the accomodation.',
    },
    reviews: {
      type: new GraphQLObjectType({
        name: "Page",
        description: "Page",
        fields: () => ({
          totalCount: { type: GraphQLInt },
          edges: {
            type: new GraphQLList(reviewType)
          },
        })
      }),
      description: 'Accomodation review.',
      args: {
        first: {
          type: GraphQLInt,
          description: "Limits the number of results returned in the page. Defaults to 10."
        },
        offset: {
          type: GraphQLInt,
          description: "Offset. Defaults to 0"
        }
      },
      resolve: (accomodation, { first = 10, offset = 0 }) => {
        const reviews = getReviews(accomodation.id);
        const offsetIndex = offset;
        const edges = reviews.slice(offsetIndex, offsetIndex + first);

        return {
          totalCount: reviews.length,
          edges
        };
      },
    },
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    accomodations: {
      type: new GraphQLList(GraphQLString),
      resolve: () => getAccomodations()
    },
    accomodation: {
      type: accommodationType,
      args: {
        id: {
          description: 'id of the accomodation',
          type: GraphQLString
        }
      },
      resolve: (root, { id }) => getAccomodation(id)
    },
    traveledWith: {
      type: new GraphQLList(GraphQLString),
      resolve: () => getTraveledWith()
    },
  })
});

export const accommodationSchema = new GraphQLSchema({
  query: queryType,
  types: [accommodationType]
});
