import http from 'http';
import express from 'express';
import graphqlHTTP from 'express-graphql';

import config from './config.json';

import { StarWarsSchema } from './graphql/schema.js';

let app = express();

app.use('/graphql', graphqlHTTP({
  schema: StarWarsSchema,
  graphiql: true
}));

app.listen(process.env.PORT || config.port, function() {
  console.log(`Express server listening on port ${this.address().port}`);
});

export default app;
