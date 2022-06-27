import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {ApiResponseCommonData, Image} from '../types'

export type ApiProduct = {
  id: string
  images: Image[]
  name: string
}

export type ProductEdge = {
  node: ApiProduct
}

export type ProductCountableEdge = ProductEdge & {
  cursor: string
}

export type ProductsData = ApiResponseCommonData & {
  edges: ProductCountableEdge[]
}

export type ProductsFnResponse = {
  pagination: Pagination
  products: Product[]
}
