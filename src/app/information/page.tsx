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
import { GET_CHARACTERS, GET_CHARACTER_BY_ID, type Character, type DetailedCharacter } from '../../lib/queries';

/**
 * Information page component
 * 
 * Displays Rick and Morty characters in a table format with modal details.
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

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<DetailedCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetch characters data
   */
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<{ characters: { results: Character[], info: { pages: number } } }>({
          query: GET_CHARACTERS,
          variables: { page },
        });
        setCharacters(result.data?.characters?.results || []);
        setTotalPages(result.data?.characters?.info?.pages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isUserAuthenticated()) {
      fetchCharacters();
    }
  }, [isAuthenticated, page]);

  /**
   * Fetch detailed character information
   * 
   * @param {string} id - Character ID
   */
  const fetchCharacterDetails = async (id: string) => {
    try {
      setDetailLoading(true);
      const result = await apolloClient.query<{ character: DetailedCharacter }>({
        query: GET_CHARACTER_BY_ID,
        variables: { id },
      });
      setSelectedCharacter(result.data?.character || null);
      onOpen();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch character details');
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


  // Show authentication block if user is not authenticated
  if (!isAuthenticated || !isUserAuthenticated()) {
    return <AuthBlock />;
  }

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Text fontSize="xl">Loading characters...</Text>
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
        <Heading size="xl" mb={2}>Rick and Morty Characters</Heading>
        <Text color="gray.600">Page {page} - Showing {characters.length} characters</Text>
      </Box>

      {/* Characters Table */}
      <Box overflowX="auto">
        <Box as="table" width="100%" borderCollapse="collapse">
          <Box as="thead" bg="gray.100">
            <Box as="tr">
              <Box as="th" p={4} textAlign="left">Image</Box>
              <Box as="th" p={4} textAlign="left">Name</Box>
              <Box as="th" p={4} textAlign="left">Status</Box>
              <Box as="th" p={4} textAlign="left">Species</Box>
              <Box as="th" p={4} textAlign="left">Gender</Box>
              <Box as="th" p={4} textAlign="left">Origin</Box>
              <Box as="th" p={4} textAlign="left">Actions</Box>
            </Box>
          </Box>
          <Box as="tbody">
            {characters.map((character) => (
              <Box 
                as="tr" 
                key={character.id} 
                _hover={{ bg: 'gray.50' }}
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <Box as="td" p={4}>
                  <Image
                    src={character.image}
                    alt={character.name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
                <Box as="td" p={4} fontWeight="medium">{character.name}</Box>
                <Box as="td" p={4}>
                  <Badge 
                    colorScheme={
                      character.status === 'Alive' ? 'green' : 
                      character.status === 'Dead' ? 'red' : 'gray'
                    }
                  >
                    {character.status}
                  </Badge>
                </Box>
                <Box as="td" p={4}>{character.species}</Box>
                <Box as="td" p={4}>{character.gender}</Box>
                <Box as="td" p={4}>{character.origin.name}</Box>
                <Box as="td" p={4}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => fetchCharacterDetails(character.id)}
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
        >
          Previous
        </Button>
        <Text>Page {page} of {totalPages}</Text>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </Box>

      {/* Character Details Modal */}
      {open && selectedCharacter && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          onClick={onClose}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            maxW="500px"
            width="90%"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              position="absolute"
              right={4}
              top={4}
              onClick={onClose}
            />
            <Image
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
              width="100%"
              height="300px"
              objectFit="cover"
              borderRadius="md"
              mb={4}
            />
            <Heading size="lg" mb={4}>{selectedCharacter.name}</Heading>
            <Box mb={4}>
              <Text><strong>Status:</strong> {selectedCharacter.status}</Text>
              <Text><strong>Species:</strong> {selectedCharacter.species}</Text>
              <Text><strong>Gender:</strong> {selectedCharacter.gender}</Text>
              <Text><strong>Origin:</strong> {selectedCharacter.origin.name}</Text>
              <Text><strong>Location:</strong> {selectedCharacter.location.name}</Text>
              <Text><strong>Created:</strong> {formatDate(selectedCharacter.created)}</Text>
            </Box>
            {selectedCharacter.episode.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>Episodes ({selectedCharacter.episode.length}):</Text>
                <Box maxH="200px" overflowY="auto">
                  {selectedCharacter.episode.map((ep) => (
                    <Text key={ep.id} fontSize="sm">
                      {ep.name} (Episode {ep.episode})
                    </Text>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

// 强制动态渲染，避免 useSearchParams() 在静态生成时的错误
export const dynamic = 'force-dynamic';
