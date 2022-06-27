import {Product} from '@contentful/ecommerce-app-base'
import {uniqBy} from 'lodash'
import {ITEMS_OFFSET} from '../constants'
import {DisplayLabelPrefix, Identifiers} from '../types'
import {ProductEdge, ProductsData, ProductsFnResponse} from './types'

class ProductDataParser {
  private data: ProductsData
  private productsIds: string[]

  private static paginationConfig = {
    count: ITEMS_OFFSET,
    limit: ITEMS_OFFSET,
    offset: ITEMS_OFFSET,
  }

  constructor(data: ProductsData, productsIds: Identifiers = []) {
    this.data = data
    this.productsIds = productsIds
  }

  getParsedData = (): ProductsFnResponse => ({
    pagination: this.getParsedPagination(),
    products: this.getParsedProducts(),
  })

  private getParsedPagination = () => ({
    ...ProductDataParser.paginationConfig,
    total: this.selectItemsTotal(),
    hasNextPage: this.data.pageInfo.hasNextPage,
  })

  getParsedItems = (): Product[] =>
    this.data.edges.map(ProductDataParser.getParsedItem)

  private selectItemsTotal = () =>
    this.data.totalCount > ITEMS_OFFSET
      ? this.data.totalCount
      : this.getParsedProducts().length

  private shouldDisplayProduct = ({id}: Product): boolean =>
    !this.productsIds.includes(id)

  getProductsIds = (): string[] => this.getParsedProducts().map(({id}) => id)

  private static getDisplayLabel = (id: string) =>
    `${DisplayLabelPrefix.productID}: ${id}`

  private getParsedProducts = (): Product[] =>
    uniqBy(
      this.data.edges
        .map<Product>(ProductDataParser.getParsedItem)
        .filter(this.shouldDisplayProduct),
      'id',
    )

  private static getParsedItem = ({node: {id, name, images}}: ProductEdge) => {
    return {
      id,
      displaySKU: ProductDataParser.getDisplayLabel(id),
      sku: id,
      name,
      image: images[0]?.url || '',
    }
  }
}

export default ProductDataParser
