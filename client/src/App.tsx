import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'; // components needed to interact with GraphQL server.
import {setContext} from '@apollo/client/link/context'; //set new context of a request.
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

//create http link to GraphQl endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

//setup a request middleware to attach JWT Token to every request as a authorization header.
const authLink = setContext((_, {headers}) =>{
  //retrieve autherntication token from local storage.
  const token = localStorage.getItem('id_token');

  //return headers to context for httpLink to process.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };


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
