import {DialogExtensionSDK, FieldExtensionSDK} from '@contentful/app-sdk'
import {setup, renderSkuPicker} from '@contentful/ecommerce-app-base'
import CollectionPaginatedFetcher from './collections/CollectionPaginatedFetcher'
import {dialogConfig, DIALOG_ID, SKUPickerConfig, strings} from './constants'

import ProductPaginatedFetcher from './products/ProductPaginatedFetcher'
import {getSkuPickerArgs} from './skuResolvers'
import {ClientConfig, ESkuType, Identifiers} from './types'

const makeCTA = (fieldType: string, skuType: ESkuType) => {
  switch (skuType) {
    case ESkuType.category:
      return fieldType === 'Array'
        ? strings.selectCategories
        : strings.selectCategory

    case ESkuType.collection:
      return fieldType === 'Array'
        ? strings.selectCollections
        : strings.selectCollection

    case ESkuType.product:
    default:
      return fieldType === 'Array'
        ? strings.selectProducts
        : strings.selectProduct
  }
}

const validateParameters = (parameters: ClientConfig): string | null => {
  if (parameters.apiEndpoint.length < 1) {
    return 'Missing API Endpoint'
  }

  return null
}

const createContainer = () => {
  const container = document.createElement('div')
  container.id = DIALOG_ID
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  document.body.appendChild(container)
}

const renderDialog = async (sdk: DialogExtensionSDK) => {
  createContainer()
  const invocation = sdk.parameters?.invocation as any
  const skuType = invocation?.skuType as ESkuType

  const {fetchProductPreviews, fetchProducts} = await getSkuPickerArgs(
    sdk,
    skuType,
  )
  renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts,
  })

  sdk.window.startAutoResizer()
}

const openDialog = async (
  sdk: FieldExtensionSDK,
  currentValue: any,
  parameters: ClientConfig & {skuType: ESkuType},
) => {
  const skus = await sdk.dialogs.openCurrentApp({
    title: makeCTA(sdk.field.type, parameters.skuType),
    // @ts-expect-error Incompatible types
    parameters,
    ...dialogConfig,
  })

  return Array.isArray(skus) ? skus : []
}

const fetchProductPreviews = (
  identifiers: Identifiers,
  config: ClientConfig,
  skuType: ESkuType,
) => {
  if (skuType === ESkuType.collection) {
    return new CollectionPaginatedFetcher(config).getCollectionsById(
      identifiers,
    )
  }
  return new ProductPaginatedFetcher(config).getProductsAndVariantsByIdOrSKU(
    identifiers,
  )
}

const config = {
  ...SKUPickerConfig,
  makeCTA,
  isDisabled: () => false,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  validateParameters,
}

// @ts-ignore in order to keep ClientConfig type instead of sku apps' Record<string, string>
setup(config)
