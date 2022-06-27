import {Pagination, Product} from '@contentful/ecommerce-app-base'
import {ApiProduct} from '../products/types'
import {ApiResponseCommonData, Image} from '../types'

export type ApiVariant = {
  id: string
  sku: string
  name: string
  images: Image[]
  product: ApiProduct
}

export type ApiVariantEdge = {
  node: ApiVariant
}

export type VariantCountableEdge = ApiVariantEdge & {
  cursor: string
}

export type VariantsData = ApiResponseCommonData & {
  edges: VariantCountableEdge[]
}

// Use same contentful product schema for variants.
export type Variant = Product
export type VariantsFnResponse = {
  pagination: Pagination
  products: Product[]
}
