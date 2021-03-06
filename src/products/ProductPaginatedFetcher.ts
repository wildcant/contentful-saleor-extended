import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {uniq} from 'lodash'
import ApiClient from '../ApiClient'
import {defaultPagination} from '../constants'
import {ClientConfig, Identifiers} from '../types'
import DataParser from './ProductDataParser'
import {ProductsData} from './types'

interface FetcherPagination {
  paginationInfo?: Pagination
  endCursor?: string
  productIds?: Identifiers
}

class ProductPaginatedFetcher {
  apiClient: ApiClient
  endCursor: string = ''
  previousCursor: string = ''
  lastSearch?: string
  productsIds: string[] = []
  lastPaginationInfo: Pagination = defaultPagination

  constructor({apiEndpoint}: ClientConfig) {
    this.apiClient = new ApiClient({apiEndpoint})
  }

  searchProducts = async (search: string) => {
    if (this.shouldReturnNoProducts(search)) {
      return this.getNoItemsResponse()
    }

    this.resetPagination(search)

    const data = await this.getProductsByIdOrName(search)
    const parsedData = new DataParser(data, this.productsIds).getParsedData()

    this.updatePagination(data)
    return parsedData
  }

  private getProductsByIdOrName = async (search: string) => {
    const dataByName = await this.apiClient.fetchProducts({
      search,
      endCursor: this.endCursor,
    })

    if (dataByName.totalCount === 0) {
      const idsOfSearch = search.split(' ')
      const dataByIds = await this.apiClient.fetchProducts({
        productIds: idsOfSearch,
        endCursor: this.endCursor,
      })
      return dataByIds
    }

    return dataByName
  }

  getProductsById = async (identifiers: Identifiers) => {
    let result: Product[] = []

    if (identifiers.length > 0) {
      const productsData = await this.apiClient.fetchProducts({
        productIds: identifiers,
      })
      const parsedProducts = new DataParser(productsData).getParsedItems()
      result = [...parsedProducts]
    }

    return result
  }

  // hack for avoiding doubled requests when using sku app search field
  private shouldReturnNoProducts = (search?: string) =>
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

  private updatePagination = (data: ProductsData) => {
    const dataParser = new DataParser(data)

    this.setPagination({
      paginationInfo: dataParser.getParsedData().pagination,
      endCursor: data.pageInfo.endCursor,
      productIds: uniq([
        ...this.productsIds,
        ...dataParser.getProductsIds(),
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
      productIds = [],
    }: FetcherPagination = {
      paginationInfo: defaultPagination,
      endCursor: '',
      productIds: [],
    },
  ) => {
    this.previousCursor = this.endCursor
    this.endCursor = endCursor
    this.lastPaginationInfo = paginationInfo
    this.productsIds = productIds
  }
}

export default ProductPaginatedFetcher
