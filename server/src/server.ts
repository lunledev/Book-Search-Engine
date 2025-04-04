import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express'; //for catch all route.
import './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
//import routes from './routes/index.js';
import {typeDefs, resolvers} from './Schemas/index.js';
import { authenticationToken } from './services/auth.js';

//set up the typeDefs and resolvers for ApolloServer.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//start the ApolloServer and setup connection to db.
const startApolloServer = async () => {

await server.start();
//await db();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//added route for graphql and expressMiddleware.
app.use('/graphql', expressMiddleware(server as any,{

  context: authenticationToken as any

} ))

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

//app.use(routes);

//catch all routes for get requests.
app.get('*', (_req: Request, res: Response) =>{
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});
}



  //app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});


};
startApolloServer();