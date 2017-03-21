import http from 'http';
import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';

import config from './config.json';

import { accommodationSchema } from './graphql/schema.js';

let app = express();

app.use(cors({
  exposedHeaders: config.corsHeaders
}));

app.use('/graphql', graphqlHTTP({
  schema: accommodationSchema,
  graphiql: true
}));

app.listen(process.env.PORT || config.port, function() {
  console.log(`Express server listening on port ${this.address().port}`);
});

export default app;
