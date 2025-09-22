'use client';

import React, { useState } from 'react';
import {
  Box,
  Stack,
  Input,
  Button,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Authentication blocking component
 * 
 * This component prevents access to the application until the user provides
 * their username and job title. It includes form validation and user feedback.
 * 
 * @returns {JSX.Element} Authentication blocking component
 */
export default function AuthBlock() {
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, userInfo, updateUserInfo } = useAuth();
  

  /**
   * Handle form submission
   * 
   * Validates input and either logs in or updates user information
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !jobTitle.trim()) {
      alert('Please fill in both username and job title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (userInfo) {
        // Update existing user info
        updateUserInfo({ username: username.trim(), jobTitle: jobTitle.trim() });
        alert('Your information has been updated successfully');
      } else {
        // First-time login
        login(username.trim(), jobTitle.trim());
        alert('Welcome! You can now access the application');
      }
    } catch {
      alert('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input change for username field
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Handle input change for job title field
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
  };

  return (
    <Container 
      maxW="md" 
      centerContent 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      <Box 
        w="100%" 
        p={6} 
        borderWidth="1px" 
        borderRadius="lg" 
        boxShadow="md"
        bg="white"
      >
        <Stack gap={6} as="form" onSubmit={handleSubmit}>
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              {userInfo ? 'Update Your Information' : 'Welcome to Web Team Challenge'}
            </Heading>
            <Text color="gray.600">
              {userInfo 
                ? 'You can update your username and job title below'
                : 'Please enter your username and job title to continue'
              }
            </Text>
          </Box>

          {userInfo && (
            <Box w="100%" p={3} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" color="blue.700">
                Current: {userInfo.username} - {userInfo.jobTitle}
              </Text>
            </Box>
          )}

          <Box>
            <Text fontWeight="medium" mb={2}>Username *</Text>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>Job Title *</Text>
            <Input
              type="text"
              value={jobTitle}
              onChange={handleJobTitleChange}
              placeholder="Enter your job title"
              autoComplete="organization-title"
              required
            />
          </Box>

          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            loading={isSubmitting}
          >
            {userInfo ? 'Update Information' : 'Continue to App'}
          </Button>

          {userInfo && (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Your information will be saved and available after page refresh
            </Text>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
