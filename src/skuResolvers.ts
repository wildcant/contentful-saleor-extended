import {DialogExtensionSDK} from '@contentful/app-sdk'
import ProductPaginatedFetcher from './products/ProductPaginatedFetcher'
import CollectionPaginatedFetcher from './collections/CollectionPaginatedFetcher'
import {ClientConfig, ESkuType} from './types'

export const makeProductSearchResolver = async (sdk: DialogExtensionSDK) => {
  const fetcher = new ProductPaginatedFetcher(
    sdk.parameters.installation as ClientConfig,
  )
  return fetcher.getVariantsWithProducts
}

export const makeCollectionSearchResolver = async (sdk: DialogExtensionSDK) => {
  const fetcher = new CollectionPaginatedFetcher(
    sdk.parameters.installation as ClientConfig,
  )
  return fetcher.getCollections
}

export const getSkuPickerArgs = async (
  sdk: DialogExtensionSDK,
  skuType: ESkuType,
) => {
  if (skuType === ESkuType.collection) {
    const fetcher = new CollectionPaginatedFetcher(
      sdk.parameters.installation as ClientConfig,
    )
    return {
      fetchProductPreviews: fetcher.getCollectionsById,
      fetchProducts: fetcher.getCollections,
    }
  }
  const fetcher = new ProductPaginatedFetcher(
    sdk.parameters.installation as ClientConfig,
  )
  return {
    fetchProductPreviews: fetcher.getProductsAndVariantsByIdOrSKU,
    fetchProducts: fetcher.getVariantsWithProducts,
  }
}
