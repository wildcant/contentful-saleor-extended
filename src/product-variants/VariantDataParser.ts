import {uniqBy} from 'lodash'
import {ITEMS_OFFSET} from '../constants'
import {DisplayLabelPrefix, Identifiers} from '../types'
import {
  ApiVariantEdge,
  Variant,
  VariantsData,
  VariantsFnResponse,
} from './types'

class VariantDataParser {
  private data: VariantsData
  private variantsIds: string[]

  private static paginationConfig = {
    count: ITEMS_OFFSET,
    limit: ITEMS_OFFSET,
    offset: ITEMS_OFFSET,
  }

  constructor(data: VariantsData, variantsIds: Identifiers = []) {
    this.data = data
    this.variantsIds = variantsIds
  }

  getParsedData = (): VariantsFnResponse => ({
    pagination: this.getParsedPagination(),
    products: this.getParsedVariants(),
  })

  private getParsedPagination = () => ({
    ...VariantDataParser.paginationConfig,
    total: this.selectItemsTotal(),
    hasNextPage: this.data.pageInfo.hasNextPage,
  })

  getParsedItems = (): Variant[] =>
    this.data.edges.map(VariantDataParser.getParsedItem)

  private selectItemsTotal = () =>
    this.data.totalCount > ITEMS_OFFSET
      ? this.data.totalCount
      : this.getParsedVariants().length

  private shouldDisplayProduct = ({id}: Variant): boolean =>
    !this.variantsIds.includes(id)

  getVariantsIds = (): string[] => this.getParsedVariants().map(({id}) => id)

  private static getDisplayLabel = (id: string) =>
    `${DisplayLabelPrefix.variantSKU}: ${id}`

  private getParsedVariants = (): Variant[] =>
    uniqBy(
      this.data.edges
        .map<Variant>(VariantDataParser.getParsedItem)
        .filter(this.shouldDisplayProduct),
      'id',
    )

  private static getParsedItem = ({
    node: {id, sku, name, images},
  }: ApiVariantEdge): Variant => {
    return {
      id,
      name,
      image: images[0].url || '',
      displaySKU: VariantDataParser.getDisplayLabel(id),
      sku: sku,
    }
  }
}

export default VariantDataParser
