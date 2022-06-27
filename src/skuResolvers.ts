import {DialogExtensionSDK} from '@contentful/app-sdk'
import ProductPaginatedFetcher from './products/ProductPaginatedFetcher'
import CollectionPaginatedFetcher from './collections/CollectionPaginatedFetcher'
import {ClientConfig, ESkuType} from './types'
import VariantPaginatedFetcher from './product-variants/VariantPaginatedFetcher'

export const getSkuPickerArgs = async (
  sdk: DialogExtensionSDK,
  skuType: ESkuType,
) => {
  if (skuType === ESkuType.variant) {
    const fetcher = new VariantPaginatedFetcher(
      sdk.parameters.installation as ClientConfig,
    )
    return {
      fetchProductPreviews: fetcher.getVariantsBySku,
      fetchProducts: fetcher.searchVariants,
    }
  }

  if (skuType === ESkuType.collection) {
    const fetcher = new CollectionPaginatedFetcher(
      sdk.parameters.installation as ClientConfig,
    )
    return {
      fetchProductPreviews: fetcher.getCollectionsById,
      fetchProducts: fetcher.searchCollections,
    }
  }

  const fetcher = new ProductPaginatedFetcher(
    sdk.parameters.installation as ClientConfig,
  )
  return {
    fetchProductPreviews: fetcher.getProductsById,
    fetchProducts: fetcher.searchProducts,
  }
}
