import {print} from 'graphql/language/printer'
import {DocumentNode} from 'graphql'
import {
  fetchCollectionsQuery,
  fetchProductsQuery,
  fetchProductVariantsQuery,
} from './queries'
import {ProductsData} from './products/types'
import {ClientConfig, Identifiers} from './types'
import {CollectionsData} from './collections/types'
import {VariantsData} from './product-variants/types'

type FetchVariantsParams = {
  search?: string
  skus?: Identifiers
  endCursor?: string
}

type FetchProductsParams = {
  search?: string
  productIds?: Identifiers
  endCursor?: string
}

type FetchCollectionsParams = {
  search?: string
  collectionIds?: Identifiers
  endCursor?: string
}

class ApiClient {
  private apiEndpoint: string

  constructor({apiEndpoint}: ClientConfig) {
    this.apiEndpoint = apiEndpoint
  }

  fetchVariants = async ({
    search,
    skus,
    endCursor,
  }: FetchVariantsParams): Promise<VariantsData> => {
    const res = await this.fetch(
      fetchProductVariantsQuery(search, skus, endCursor),
    )

    const {
      data: {productVariants},
    } = await res.json()

    return productVariants
  }

  fetchProducts = async ({
    search,
    productIds,
    endCursor,
  }: FetchProductsParams): Promise<ProductsData> => {
    const res = await this.fetch(
      fetchProductsQuery(search, productIds, endCursor),
    )

    const {
      data: {products},
    } = await res.json()

    return products
  }

  fetchCollections = async ({
    search,
    collectionIds,
    endCursor,
  }: FetchCollectionsParams): Promise<CollectionsData> => {
    const res = await this.fetch(
      fetchCollectionsQuery(search, collectionIds, endCursor),
    )

    const {
      data: {collections},
    } = await res.json()

    return collections
  }

  private fetch = (query: DocumentNode) =>
    window.fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: print(query)}),
    })
}

export default ApiClient
