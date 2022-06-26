import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {ApiResponseCommonData, Image} from '../types'

export type ApiCollectionEdge = {
  node: {
    id: string
    name: string
    backgroundImage: Image
  }
}

export type ApiCollection = {
  id: string
  name: string
  backgroundImage: Image
}

export type CollectionCountableEdge = {
  node: ApiCollection
  cursor: string
}

export type CollectionsData = ApiResponseCommonData & {
  edges: CollectionCountableEdge[]
}

// Use same contentful product schema for collections.
export type Collection = Product
export type CollectionsFnResponse = {
  pagination: Pagination
  products: Product[]
}
