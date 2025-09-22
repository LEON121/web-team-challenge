'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Box, Heading, Button, Text, Container, 
  Image, useDisclosure, Badge, CloseButton
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import AuthBlock from '../../components/AuthBlock';
import { apolloClient, isUserAuthenticated } from '../../lib/apolloClient';
import { GET_LAUNCHES, GET_LAUNCH_BY_ID, type Launch, type DetailedLaunch } from '../../lib/queries';

/**
 * Information page component
 * 
 * Displays SpaceX launches in a table format with modal details.
 * Requires user authentication before showing data.
 * 
 * @returns {JSX.Element} Information page component
 */
export default function InformationPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { open, onOpen, onClose } = useDisclosure();
  
  // Get page from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedLaunch, setSelectedLaunch] = useState<DetailedLaunch | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch launches data
   */
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<{ launches: Launch[] }>({
          query: GET_LAUNCHES,
          variables: { limit, offset },
        });
        setLaunches(result.data?.launches || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isUserAuthenticated()) {
      fetchLaunches();
    }
  }, [isAuthenticated, limit, offset]);

  /**
   * Fetch detailed launch information
   * 
   * @param {string} id - Launch ID
   */
  const fetchLaunchDetails = async (id: string) => {
    try {
      setDetailLoading(true);
      const result = await apolloClient.query<{ launch: DetailedLaunch }>({
        query: GET_LAUNCH_BY_ID,
        variables: { id },
      });
      setSelectedLaunch(result.data?.launch || null);
      onOpen();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch launch details');
    } finally {
      setDetailLoading(false);
    }
  };

  /**
   * Handle pagination navigation
   * 
   * @param {number} newPage - The page number to navigate to
   */
  const handlePageChange = (newPage: number) => {
    router.push(`/information?page=${newPage}`);
  };

  /**
   * Format date string to readable format
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get status badge based on launch success
   * 
   * @param {boolean | null} success - Launch success status
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (success: boolean | null) => {
    if (success === null) return <Badge colorScheme="gray">Unknown</Badge>;
    return success ? <Badge colorScheme="green">Success</Badge> : <Badge colorScheme="red">Failure</Badge>;
  };

  // Show authentication block if user is not authenticated
  if (!isAuthenticated || !isUserAuthenticated()) {
    return <AuthBlock />;
  }

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Text fontSize="xl">Loading launches...</Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Text fontSize="xl" color="red.500">Error loading data: {error}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" mb={2}>SpaceX Launches</Heading>
        <Text color="gray.600">Page {page} - Showing {launches.length} launches</Text>
      </Box>

      {/* Launches Table */}
      <Box overflowX="auto">
        <Box as="table" width="100%" borderCollapse="collapse">
          <Box as="thead" bg="gray.100">
            <Box as="tr">
              <Box as="th" p={4} textAlign="left">Mission Patch</Box>
              <Box as="th" p={4} textAlign="left">Mission Name</Box>
              <Box as="th" p={4} textAlign="left">Launch Date</Box>
              <Box as="th" p={4} textAlign="left">Rocket</Box>
              <Box as="th" p={4} textAlign="left">Status</Box>
              <Box as="th" p={4} textAlign="left">Actions</Box>
            </Box>
          </Box>
          <Box as="tbody">
            {launches.map((launch) => (
              <Box 
                as="tr" 
                key={launch.id} 
                _hover={{ bg: 'gray.50' }}
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <Box as="td" p={4}>
                  {launch.links.mission_patch_small ? (
                    <Image
                      src={launch.links.mission_patch_small}
                      alt={launch.mission_name}
                      boxSize="50px"
                      objectFit="contain"
                    />
                  ) : (
                    <Text fontSize="sm" color="gray.500">No image</Text>
                  )}
                </Box>
                <Box as="td" p={4} fontWeight="medium">{launch.mission_name}</Box>
                <Box as="td" p={4}>{formatDate(launch.launch_date_utc)}</Box>
                <Box as="td" p={4}>{launch.rocket.rocket_name}</Box>
                <Box as="td" p={4}>{getStatusBadge(launch.launch_success)}</Box>
                <Box as="td" p={4}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => fetchLaunchDetails(launch.id)}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={4} mt={8}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          colorScheme="blue"
          variant="outline"
        >
          Previous
        </Button>
        <Text>Page {page}</Text>
        <Button
          onClick={() => handlePageChange(page + 1)}
          colorScheme="blue"
          variant="outline"
        >
          Next
        </Button>
      </Box>

      {/* Modal for detailed view */}
      {open && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          onClick={onClose}
        >
          <Box
            bg="white"
            borderRadius="lg"
            width="90%"
            maxW="600px"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" p={4} borderBottom="1px solid" borderColor="gray.200">
              <Heading size="lg">Launch Details</Heading>
              <CloseButton onClick={onClose} />
            </Box>
            <Box p={4}>
              {detailLoading && <Text>Loading details...</Text>}
              {selectedLaunch && (
                <Box>
                  <Heading size="lg" mb={4}>{selectedLaunch.mission_name}</Heading>
                  {selectedLaunch.links.mission_patch && (
                    <Image 
                      src={selectedLaunch.links.mission_patch} 
                      alt={selectedLaunch.mission_name}
                      boxSize="100px"
                      objectFit="contain"
                      mb={4}
                    />
                  )}
                  <Text><strong>Launch Date:</strong> {formatDate(selectedLaunch.launch_date_utc)}</Text>
                  <Text><strong>Rocket:</strong> {selectedLaunch.rocket.rocket_name} ({selectedLaunch.rocket.rocket_type})</Text>
                  <Text><strong>Status:</strong> {getStatusBadge(selectedLaunch.launch_success)}</Text>
                  <Text><strong>Launch Site:</strong> {selectedLaunch.launch_site.site_name_long}</Text>
                  {selectedLaunch.details && (
                    <Text mt={4}><strong>Details:</strong> {selectedLaunch.details}</Text>
                  )}
                  {selectedLaunch.links.article_link && (
                    <Text mt={2}><a href={selectedLaunch.links.article_link} target="_blank" rel="noopener noreferrer">Article Link</a></Text>
                  )}
                  {selectedLaunch.links.video_link && (
                    <Text mt={2}><a href={selectedLaunch.links.video_link} target="_blank" rel="noopener noreferrer">Video Link</a></Text>
                  )}
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-end" p={4} borderTop="1px solid" borderColor="gray.200">
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}
