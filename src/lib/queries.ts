import { gql } from '@apollo/client';

/**
 * GraphQL queries for SpaceX API
 * 
 * This file contains all GraphQL queries used to fetch data from the SpaceX API.
 * The queries are designed to retrieve launches with images and detailed information.
 */

/**
 * Query to fetch paginated launches with images
 * 
 * Retrieves a list of SpaceX launches with mission details, images, and pagination support
 * 
 * @param {number} limit - Number of items to fetch per page
 * @param {number} offset - Offset for pagination
 * @returns {DocumentNode} GraphQL query document
 */
export const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int!, $offset: Int!) {
    launches(limit: $limit, offset: $offset) {
      id
      mission_name
      launch_date_utc
      launch_success
      rocket {
        rocket_name
        rocket_type
      }
      links {
        mission_patch
        mission_patch_small
        flickr_images
        article_link
        video_link
      }
      details
    }
  }
`;

/**
 * Query to fetch a specific launch by ID
 * 
 * Retrieves detailed information about a specific SpaceX launch
 * 
 * @param {string} id - The ID of the launch to fetch
 * @returns {DocumentNode} GraphQL query document
 */
export const GET_LAUNCH_BY_ID = gql`
  query GetLaunchById($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_utc
      launch_success
      static_fire_date_utc
      tentative_max_precision
      upcoming
      rocket {
        rocket_name
        rocket_type
        rocket {
          company
          country
          description
          height {
            meters
            feet
          }
          diameter {
            meters
            feet
          }
          mass {
            kg
            lb
          }
        }
      }
      launch_site {
        site_name
        site_name_long
      }
      links {
        mission_patch
        mission_patch_small
        flickr_images
        article_link
        video_link
        wikipedia
        presskit
        reddit_campaign
        reddit_launch
        reddit_recovery
        reddit_media
      }
      details
    }
  }
`;

/**
 * Query to fetch total count of launches
 * 
 * Retrieves the total number of launches for pagination calculations
 * 
 * @returns {DocumentNode} GraphQL query document
 */
export const GET_LAUNCHES_COUNT = gql`
  query GetLaunchesCount {
    launches {
      id
    }
  }
`;

/**
 * Interface for Launch data
 * 
 * TypeScript interface defining the structure of launch data returned from GraphQL queries
 */
export interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean | null;
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
  links: {
    mission_patch: string | null;
    mission_patch_small: string | null;
    flickr_images: string[];
    article_link: string | null;
    video_link: string | null;
  };
  details: string | null;
}

/**
 * Interface for detailed Launch data
 * 
 * Extended interface for detailed launch information including rocket and launch site details
 */
export interface DetailedLaunch extends Launch {
  static_fire_date_utc: string | null;
  tentative_max_precision: string | null;
  upcoming: boolean;
  rocket: {
    rocket_name: string;
    rocket_type: string;
    rocket: {
      company: string;
      country: string;
      description: string;
      height: {
        meters: number;
        feet: number;
      };
      diameter: {
        meters: number;
        feet: number;
      };
      mass: {
        kg: number;
        lb: number;
      };
    };
  };
  launch_site: {
    site_name: string;
    site_name_long: string;
  };
  links: {
    mission_patch: string | null;
    mission_patch_small: string | null;
    flickr_images: string[];
    article_link: string | null;
    video_link: string | null;
    wikipedia: string | null;
    presskit: string | null;
    reddit_campaign: string | null;
    reddit_launch: string | null;
    reddit_recovery: string | null;
    reddit_media: string | null;
  };
}
