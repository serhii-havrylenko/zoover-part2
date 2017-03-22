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

import { Accommodations } from './Accommodations.js';

const acc = new Accommodations();

const reviewType = new GraphQLObjectType({
  name: 'Review',
  description: 'Accommodation review',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the accommodation.',
    },
    traveledWith: {
      type: new GraphQLNonNull(GraphQLString),
      dexcription: 'Traveled with'
    },
    entryDate: {
      type: GraphQLFloat,
      description: 'Review entryDate'
    },
    travelDate: {
      type: GraphQLFloat,
      description: 'Review travelDate'
    },
    title: {
      type: GraphQLString,
      description: 'Review title',
      resolve: (review) => acc.getReviewTitle(review)
    },
    text: {
      type: GraphQLString,
      description: 'Review text',
      resolve: (review) => acc.getReviewTitle(review)
    },
    user: {
      type: GraphQLString,
      description: 'Review user'
    },
    locale: {
      type: GraphQLString,
      description: 'Review locale'
    }
  })
});

const accommodationType = new GraphQLObjectType({
  name: 'Accommodation',
  description: 'Accommodation info with statistic and reviews',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the accommodation.',
    },
    ranking: {
      type: new GraphQLObjectType({
        name: 'AccommodationRanking',
        description: 'Accommodation ranking calculated by reviews',
        fields: () => ({
          general: {
            type: new GraphQLNonNull(GraphQLFloat),
            description: 'General accommodation ranking'
          },
          aspects: {
            type: new GraphQLObjectType({
              name: 'AspectsRanking',
              description: 'Aspects ranking calculated by reviews',
              fields: () => ({
                location: {
                  type: GraphQLFloat,
                  description: 'Ranking for location',
                },
                service: {
                  type: GraphQLFloat,
                  description: 'Ranking for service',
                },
                priceQuality: {
                  type: GraphQLFloat,
                  description: 'Ranking for priceQuality',
                },
                food: {
                  type: GraphQLFloat,
                  description: 'Ranking for food',
                },
                room: {
                  type: GraphQLFloat,
                  description: 'Ranking for room',
                },
                childFriendly: {
                  type: GraphQLFloat,
                  description: 'Ranking for childFriendly',
                },
                interior: {
                  type: GraphQLFloat,
                  description: 'Ranking for interior',
                },
                size: {
                  type: GraphQLFloat,
                  description: 'Ranking for size',
                },
                activities: {
                  type: GraphQLFloat,
                  description: 'Ranking for activities',
                },
                restaurants: {
                  type: GraphQLFloat,
                  description: 'Ranking for restaurants',
                },
                sanitaryState: {
                  type: GraphQLFloat,
                  description: 'Ranking for sanitaryState',
                },
                accessibility: {
                  type: GraphQLFloat,
                  description: 'Ranking for accessibility',
                },
                nightlife: {
                  type: GraphQLFloat,
                  description: 'Ranking for nightlife',
                },
                culture: {
                  type: GraphQLFloat,
                  description: 'Ranking for culture',
                },
                surrounding: {
                  type: GraphQLFloat,
                  description: 'Ranking for surrounding',
                },
                atmosphere: {
                  type: GraphQLFloat,
                  description: 'Ranking for atmosphere',
                },
                noviceSkiArea: {
                  type: GraphQLFloat,
                  description: 'Ranking for noviceSkiArea',
                },
                advancedSkiArea: {
                  type: GraphQLFloat,
                  description: 'Ranking for advancedSkiArea',
                },
                apresSki: {
                  type: GraphQLFloat,
                  description: 'Ranking for apresSki',
                },
                beach: {
                  type: GraphQLFloat,
                  description: 'Ranking for beach',
                },
                entertainment: {
                  type: GraphQLFloat,
                  description: 'Ranking for entertainment',
                },
                environmental: {
                  type: GraphQLFloat,
                  description: 'Ranking for environmental',
                },
                pool: {
                  type: GraphQLFloat,
                  description: 'Ranking for pool',
                },
                terrace: {
                  type: GraphQLFloat,
                  description: 'Ranking for terrace',
                }
              })
            }),
            description: 'Aspects ranking calculated by reviews',
            resolve: (ranking) => ranking.aspects
          }
        })
      }),
      resolve: (accommodation) => acc.getAccommodationRanking(accommodation.id)
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
      description: 'Accommodation review.',
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
      resolve: (accommodation, { first = 10, offset = 0 }) => {
        const reviews = acc.getReviews(accommodation.id);
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
    accommodations: {
      type: new GraphQLList(GraphQLString),
      resolve: () => acc.getAccommodations()
    },
    accommodation: {
      type: accommodationType,
      args: {
        id: {
          description: 'id of the accommodation',
          type: GraphQLString
        }
      },
      resolve: (root, { id }) => acc.getAccommodation(id)
    },
    traveledWith: {
      type: new GraphQLList(GraphQLString),
      resolve: () => acc.getTraveledWith()
    },
  })
});

export const accommodationSchema = new GraphQLSchema({
  query: queryType,
  types: [accommodationType]
});
