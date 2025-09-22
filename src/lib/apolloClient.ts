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
 * 关键功能：验证用户是否已认证
 * 1. 检查是否在浏览器环境（避免服务端渲染错误）
 * 2. 检查 localStorage 中是否存在用户信息
 * 3. 返回布尔值表示认证状态
 * 
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isUserAuthenticated = (): boolean => {
  // 关键：检查浏览器环境，避免 Next.js SSR 错误
  if (typeof window === 'undefined') return false;
  
  // 关键：检查 localStorage 中是否有用户信息
  return !!localStorage.getItem('userInfo');
};

/**
 * Helper function to get user information
 * 
 * 关键功能：获取用户信息
 * 1. 检查是否在浏览器环境（避免服务端渲染错误）
 * 2. 从 localStorage 读取用户信息
 * 3. 解析 JSON 数据并返回用户对象
 * 4. 错误处理：解析失败时返回 null
 * 
 * @returns {Object | null} User information object or null if not authenticated
 */
export const getUserInfo = (): { username: string; jobTitle: string } | null => {
  // 关键：检查浏览器环境，避免 Next.js SSR 错误
  if (typeof window === 'undefined') return null;
  
  try {
    // 关键：从 localStorage 获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    
    // 关键：解析 JSON 字符串并返回用户对象
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    // 错误处理：JSON 解析失败时返回 null
    return null;
  }
};
