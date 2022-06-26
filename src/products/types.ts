import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {ApiResponseCommonData, Image} from '../types'

export type ApiData = ApiResponseCommonData & {
  edges: ApiProductOrVariantEdge[]
}

export type ApiProductOrVariantEdge = {
  node: {
    id: string
    sku?: string
    name: string
    images: Image[]
    product?: ApiProduct
  }
}

export type ProductVariantsData = ApiResponseCommonData & {
  edges: ProductVariantCountableEdge[]
}

export type ProductsData = ApiResponseCommonData & {
  edges: ProductCountableEdge[]
}

export type ProductVariantCountableEdge = {
  node: ApiProductVariant
  cursor: string
}

export type ProductCountableEdge = {
  node: ApiProduct
  cursor: string
}

export type ApiProductVariant = {
  id: string
  sku: string
  name: string
  images: Image[]
  product: ApiProduct
}

export type ApiProduct = {
  id: string
  images: Image[]
  name: string
}

export type ProductsFnResponse = {
  pagination: Pagination
  products: Product[]
}
