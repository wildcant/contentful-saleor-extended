import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {uniq} from 'lodash'
import {ClientConfig, Identifiers} from '../types'
import ApiClient from '../ApiClient'
import {
  default as CollectionDataParser,
  default as DataParser,
} from './CollectionDataParser'
import {defaultPagination} from '../constants'
import {CollectionsData} from './types'

interface FetcherPagination {
  paginationInfo?: Pagination
  endCursor?: string
  collectionIds?: Identifiers
}

class CollectionPaginatedFetcher {
  apiClient: ApiClient
  endCursor: string = ''
  previousCursor: string = ''
  lastSearch?: string
  collectionsIds: string[] = []
  lastPaginationInfo: Pagination = defaultPagination

  constructor({apiEndpoint}: ClientConfig) {
    this.apiClient = new ApiClient({apiEndpoint})
  }

  searchCollections = async (search: string) => {
    if (this.shouldReturnNoCollections(search)) {
      return this.getNoItemsResponse()
    }

    this.resetPagination(search)

    const data = await this.getCollectionsByIdOrName(search)
    const parsedData = new DataParser(data, this.collectionsIds).getParsedData()

    this.updatePagination(data)
    return parsedData
  }

  private getCollectionsByIdOrName = async (search: string) => {
    const dataByName = await this.apiClient.fetchCollections({
      search,
      endCursor: this.endCursor,
    })

    if (dataByName.totalCount === 0) {
      const idsOfSearch = search.split(' ')
      const dataByIds = await this.apiClient.fetchCollections({
        collectionIds: idsOfSearch,
        endCursor: this.endCursor,
      })
      return dataByIds
    }

    return dataByName
  }

  getCollectionsById = async (identifiers: Identifiers) => {
    let result: Product[] = []

    if (identifiers.length > 0) {
      const collectionsData = await this.apiClient.fetchCollections({
        collectionIds: identifiers,
      })
      const parsedCollections = new DataParser(collectionsData).getParsedItems()
      result = [...parsedCollections]
    }

    return result
  }

  // hack for avoiding doubled requests when using sku app search field
  private shouldReturnNoCollections = (search?: string) =>
    search === this.lastSearch && !this.endCursor && this.previousCursor

  private getNoItemsResponse = () => ({
    pagination: this.lastPaginationInfo,
    products: [],
  })

  private resetPagination = (search?: string) => {
    if (search === this.lastSearch) {
      return
    }

    this.updateSearch(search)
    this.setPagination()
  }

  private updatePagination = (data: CollectionsData) => {
    const dataParser = new CollectionDataParser(data)

    this.setPagination({
      paginationInfo: dataParser.getParsedData().pagination,
      endCursor: data.pageInfo.endCursor,
      collectionIds: uniq([
        ...this.collectionsIds,
        ...dataParser.getCollectionsIds(),
      ]) as Identifiers,
    })
  }

  private updateSearch = (search?: string) => {
    this.lastSearch = search
  }

  private setPagination = (
    {
      paginationInfo = defaultPagination,
      endCursor = '',
      collectionIds = [],
    }: FetcherPagination = {
      paginationInfo: defaultPagination,
      endCursor: '',
      collectionIds: [],
    },
  ) => {
    this.previousCursor = this.endCursor
    this.endCursor = endCursor
    this.lastPaginationInfo = paginationInfo
    this.collectionsIds = collectionIds
  }
}

export default CollectionPaginatedFetcher
