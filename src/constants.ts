import {OpenCustomWidgetOptions} from '@contentful/app-sdk'
import {Pagination} from '@contentful/ecommerce-app-base'
import logo from './app-logo.svg'
import {ESkuType} from './types'

export const DIALOG_ID = 'sku-picker-root'
export const ITEMS_OFFSET = 100
export const SALEOR_COLOR = '#3a3944'

export const defaultPagination: Pagination = {
  offset: 0,
  total: 0,
  count: 0,
  limit: 0,
  hasNextPage: false,
}

export const strings = {
  selectProducts: 'Select products',
  selectProduct: 'Select a product',
  selectCategories: 'Select categories',
  selectCategory: 'Select a category',
  selectCollections: 'Select collections',
  selectCollection: 'Select a collection',
  errors: {
    missingApiEndpoint: 'Missing Api Edpoint URL',
  },
}

export const SKU_TYPES = [
  {
    id: ESkuType.product,
    name: 'Product',
  },
  // TODO.
  // {
  //   id: ESkuType.category,
  //   name: 'Cateogory',
  // },
  {
    id: ESkuType.collection,
    name: 'Collection',
  },
]

export const SKUPickerConfig = {
  name: 'Saleor',
  logo,
  description:
    'The Saleor app allows you to attatch products from your Saleor store',
  parameterDefinitions: [
    {
      id: 'apiEndpoint',
      name: 'Store API URL',
      description: 'The url to your store API',
      type: 'Symbol',
      required: true,
    },
  ],
  color: '',
  skuTypes: SKU_TYPES,
}

export const dialogConfig: Omit<OpenCustomWidgetOptions, 'id'> = {
  allowHeightOverflow: true,
  position: 'center',
  shouldCloseOnOverlayClick: true,
  shouldCloseOnEscapePress: true,
  width: 1400,
}
