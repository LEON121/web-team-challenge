import { gql } from '@apollo/client';

/**
 * GraphQL queries for Rick and Morty API
 * 
 * This file contains all GraphQL queries used to fetch data from the Rick and Morty API.
 * The queries are designed to retrieve characters with images and detailed information.
 */

/**
 * Query to fetch paginated characters with images
 * 
 * Retrieves a list of Rick and Morty characters with details, images, and pagination support
 * 
 * @param {number} page - Page number for pagination
 * @returns {DocumentNode} GraphQL query document
 */
export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin {
          name
        }
        location {
          name
        }
        image
        episode {
          id
          name
        }
        created
      }
    }
  }
`;

/**
 * Query to fetch a specific character by ID
 * 
 * Retrieves detailed information about a specific Rick and Morty character
 * 
 * @param {string} id - The ID of the character to fetch
 * @returns {DocumentNode} GraphQL query document
 */
export const GET_CHARACTER_BY_ID = gql`
  query GetCharacterById($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
        dimension
        type
      }
      location {
        name
        dimension
        type
      }
      image
      episode {
        id
        name
        air_date
        episode
      }
      created
    }
  }
`;

/**
 * Interface for Character data
 * 
 * TypeScript interface defining the structure of character data returned from GraphQL queries
 */
export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  image: string;
  episode: {
    id: string;
    name: string;
  }[];
  created: string;
}

/**
 * Interface for detailed Character data
 * 
 * Extended interface for detailed character information including origin and location details
 */
export interface DetailedCharacter extends Character {
  origin: {
    name: string;
    dimension: string | null;
    type: string | null;
  };
  location: {
    name: string;
    dimension: string | null;
    type: string | null;
  };
  episode: {
    id: string;
    name: string;
    air_date: string;
    episode: string;
  }[];
}
