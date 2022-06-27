import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {uniq} from 'lodash'
import {ClientConfig, Identifiers} from '../types'
import ApiClient from '../ApiClient'
import {
  default as VariantDataParser,
  default as DataParser,
} from './VariantDataParser'
import {defaultPagination} from '../constants'
import {VariantsData} from './types'

interface FetcherPagination {
  paginationInfo?: Pagination
  endCursor?: string
  variantSkus?: Identifiers
}

class VariantPaginatedFetcher {
  apiClient: ApiClient
  endCursor: string = ''
  previousCursor: string = ''
  lastSearch?: string
  variantsIds: string[] = []
  lastPaginationInfo: Pagination = defaultPagination

  constructor({apiEndpoint}: ClientConfig) {
    this.apiClient = new ApiClient({apiEndpoint})
  }

  searchVariants = async (search: string) => {
    if (this.shouldReturnNoVariants(search)) {
      return this.getNoItemsResponse()
    }

    this.resetPagination(search)

    const data = await this.getVariantsBySkuOrName(search)
    const parsedData = new DataParser(data, this.variantsIds).getParsedData()

    this.updatePagination(data)
    return parsedData
  }

  private getVariantsBySkuOrName = async (search: string) => {
    const dataByName = await this.apiClient.fetchVariants({
      search,
      endCursor: this.endCursor,
    })

    if (dataByName.totalCount === 0) {
      const skusOfSearch = search.split(' ')
      const dataByIds = await this.apiClient.fetchVariants({
        skus: skusOfSearch,
        endCursor: this.endCursor,
      })
      return dataByIds
    }

    return dataByName
  }

  getVariantsBySku = async (identifiers: Identifiers) => {
    let result: Product[] = []

    if (identifiers.length > 0) {
      const variantsData = await this.apiClient.fetchVariants({
        skus: identifiers,
      })
      const parsedVariants = new DataParser(variantsData).getParsedItems()
      result = [...parsedVariants]
    }

    return result
  }

  // hack for avoiding doubled requests when using sku app search field
  private shouldReturnNoVariants = (search?: string) =>
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

  private updatePagination = (data: VariantsData) => {
    const dataParser = new VariantDataParser(data)

    this.setPagination({
      paginationInfo: dataParser.getParsedData().pagination,
      endCursor: data.pageInfo.endCursor,
      variantSkus: uniq([
        ...this.variantsIds,
        ...dataParser.getVariantsIds(),
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
      variantSkus = [],
    }: FetcherPagination = {
      paginationInfo: defaultPagination,
      endCursor: '',
      variantSkus: [],
    },
  ) => {
    this.previousCursor = this.endCursor
    this.endCursor = endCursor
    this.lastPaginationInfo = paginationInfo
    this.variantsIds = variantSkus
  }
}

export default VariantPaginatedFetcher
