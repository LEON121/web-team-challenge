import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

/**
 * Apollo Client configuration
 * 
 * This file sets up the Apollo Client for GraphQL operations with
 * proper caching and authentication context management.
 */

// Public GraphQL API endpoint (using Rick and Morty API as it contains images)
const GRAPHQL_API = 'https://rickandmortyapi.com/graphql';

/**
 * HTTP link for Apollo Client
 * 
 * Configures the connection to the GraphQL API endpoint
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_API,
});

/**
 * Authentication link for Apollo Client
 * 
 * Sets up authentication headers for GraphQL requests
 * Currently uses a public API, but can be extended for authenticated APIs
 */
const authLink = setContext((_, { headers }) => {
  // Get user info from localStorage for potential authentication
  const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
  
  return {
    headers: {
      ...headers,
      // Add authentication headers here if needed in the future
      // Authorization: userInfo ? `Bearer ${JSON.parse(userInfo).token}` : '',
    }
  };
});

/**
 * Apollo Client instance
 * 
 * Configured with caching, error handling, and proper link setup
 * Includes type policies for normalized caching
 */
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add specific field policies here if needed
          launches: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

/**
 * Helper function to check if user is authenticated before making GraphQL requests
 * 
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isUserAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('userInfo');
};

/**
 * Helper function to get user information
 * 
 * @returns {Object | null} User information object or null if not authenticated
 */
export const getUserInfo = (): { username: string; jobTitle: string } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
};
