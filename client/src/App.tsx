import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'; // components needed to interact with GraphQL server.
import {setContext} from '@apollo/client/link/context'; //set new context of a request.
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

//create http link to GraphQl endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});




function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
