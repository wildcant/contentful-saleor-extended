import gql from 'graphql-tag'
import {Identifiers} from './types'
import {ITEMS_OFFSET} from './constants'
import {getFormattedIdentifiers} from './utils'

// TODO: Figure out multi channel/multi locale queries.
export const fetchProductsQuery = (
  search: string = '',
  ids?: string[],
  lastCursor: string = '',
) => gql`
  {
    products(channel: "default-channel", first: ${ITEMS_OFFSET}, after: "${lastCursor}", filter: {search: "${search}", ids: ${getFormattedIdentifiers(
  ids,
)} }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          images {
            url
          }
        }
      }
    }
  }
`

export const fetchProductVariantsQuery = (
  search: string = '',
  skus?: Identifiers,
  lastCursor: string = '',
) => gql`
  {
    productVariants(channel: "default-channel", first: ${ITEMS_OFFSET}, after: "${lastCursor}", filter: { search: "${search}", sku: ${getFormattedIdentifiers(
  skus,
)} } ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        }
      edges {
        node {
          id
          sku
          name
          images {
            url
          }
          product{
            id
            name
            images{
              url
            }
          }
        }
      }
    }
  }
`

export const fetchCollectionsQuery = (
  search: string = '',
  ids?: string[],
  lastCursor: string = '',
) => gql`
  {
    collections(channel: "default-channel", first: ${ITEMS_OFFSET}, after: "${lastCursor}", filter: {search: "${search}", ids: ${getFormattedIdentifiers(
  ids,
)} }) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        name
        backgroundImage {
          url
        }
      }
    }
  }
  }
`
