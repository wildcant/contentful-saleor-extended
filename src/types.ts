export interface ClientConfig {
  apiEndpoint: string
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface ApiResponseCommonData {
  pageInfo: PageInfo
  totalCount: number
}

export type Image = {url: string}

export enum DisplayLabelPrefix {
  variantSKU = 'Variant SKU',
  productID = 'Product ID',
  collectionID = 'Collection ID',
}

export type Identifiers = string[]

export type Labels = string[]

export enum ESkuType {
  product = 'product',
  category = 'category',
  collection = 'collection',
  variant = 'variant',
}
