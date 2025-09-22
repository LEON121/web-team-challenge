'use client';

import { useAuth } from '../contexts/AuthContext';
import AuthBlock from '../components/AuthBlock';
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import packageJson from '../../package.json';

/**
 * Home page component
 * 
 * This is the main landing page that shows either the authentication block
 * or the main application content based on user authentication status.
 * 
 * @returns {JSX.Element} Home page component
 */
export default function Home() {
  const { isAuthenticated, userInfo, logout } = useAuth();

  /**
   * Handle logout action
   * 
   * Logs the user out and clears their information
   */
  const handleLogout = () => {
    logout();
  };

  // Show authentication block if user is not authenticated
  if (!isAuthenticated) {
    return <AuthBlock />;
  }

  return (
    <Box minH="100vh" p={4}>
      <VStack gap={6} align="center" justify="center" minH="80vh">
        <Box textAlign="center">
          <Heading size="2xl" mb={4} color="blue.600">
            Welcome to Web Team Challenge
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            Hello, {userInfo?.username} ({userInfo?.jobTitle})
          </Text>
        </Box>

        <VStack gap={4} w="100%" maxW="md">
          <Button 
            onClick={() => window.location.href = '/information'}
            colorScheme="blue" 
            size="lg" 
            w="100%"
          >
            View Information Page
          </Button>
          
          <Button 
            onClick={handleLogout} 
            colorScheme="gray" 
            variant="outline" 
            size="lg" 
            w="100%"
          >
            Logout
          </Button>
        </VStack>

        <Box mt={8} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            Web Team Challenge v{packageJson.version}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
