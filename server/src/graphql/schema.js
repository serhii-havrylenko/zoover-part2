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

import { getStations, getWeatherDates, getForecast } from './data.js';

const forecastType = new GraphQLObjectType({
  name: 'Forecast',
  description: 'Weather forecast in specific station and date.',
  fields: () => ({
    datetime: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The datetime of the forecast.',
    },
    temperature_max: {
      type: GraphQLString,
      description: 'Maximum temperature.',
    },
    temperature_min: {
      type: GraphQLString,
      description: 'Minimum temperature.',
    },
    precipitation_probability: {
      type: GraphQLString,
      description: 'Precipitation probability.',
    },
    precipitation_mm: {
      type: GraphQLString,
      description: 'Precipitation millimeters.',
    }
  })
});

const stationType = new GraphQLObjectType({
  name: 'Station',
  description: 'Weather in specific station',
  fields: () => ({
    station_id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the station.',
    },
    place_name: {
      type: GraphQLString,
      description: 'The name of the station.',
    },
    latitude: {
      type: GraphQLFloat,
      description: 'Latitude of the station.',
    },
    longitude: {
      type: GraphQLFloat,
      description: 'Longitude of the station.',
    },
    forecast: {
      type: new GraphQLList(forecastType),
      args: {
        datetime: {
          description: 'datetime for filtering.',
          type: GraphQLString
        }
      },
      description: 'Weather forecast for specific station.',
      resolve: (station, { datetime }) => getForecast(station.station_id, datetime),
    },
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    stations: {
      type: new GraphQLList(stationType),
      args: {
        station_id: {
          description: 'id of the station',
          type: GraphQLInt
        }
      },
      resolve: (root, { station_id }) => getStations(station_id)
    },
    dates: {
      type: new GraphQLList(GraphQLString),
      resolve: function() {
        return getWeatherDates();
      }
    },
  })
});

export const weatherForecastSchema = new GraphQLSchema({
  query: queryType,
  types: [stationType, forecastType]
});
