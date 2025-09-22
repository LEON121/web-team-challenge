'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider } from '../contexts/AuthContext';
import { Box, Container, Text } from '@chakra-ui/react';
import packageJson from '../../package.json';

/**
 * Client-side layout component
 * 
 * Wraps the application with client-side providers that cannot be used
 * in server components (like AuthProvider with React context)
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Client layout component
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        {children}
        {/* Global Footer */}
        <Box as="footer" bg="gray.100" py={4} mt={8}>
          <Container maxW="container.xl" textAlign="center">
            <Text fontSize="sm" color="gray.600">
              Web Team Challenge - v{packageJson.version}
            </Text>
          </Container>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
}
