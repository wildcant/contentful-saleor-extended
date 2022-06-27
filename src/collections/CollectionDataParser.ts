import {uniqBy} from 'lodash'
import {ITEMS_OFFSET} from '../constants'
import {DisplayLabelPrefix, Identifiers} from '../types'
import {
  ApiCollectionEdge,
  Collection,
  CollectionsData,
  CollectionsFnResponse,
} from './types'

class CollectionDataParser {
  private data: CollectionsData
  private collectionsIds: string[]

  private static paginationConfig = {
    count: ITEMS_OFFSET,
    limit: ITEMS_OFFSET,
    offset: ITEMS_OFFSET,
  }

  constructor(data: CollectionsData, collectionsIds: Identifiers = []) {
    this.data = data
    this.collectionsIds = collectionsIds
  }

  getParsedData = (): CollectionsFnResponse => ({
    pagination: this.getParsedPagination(),
    products: this.getParsedCollections(),
  })

  private getParsedPagination = () => ({
    ...CollectionDataParser.paginationConfig,
    total: this.selectItemsTotal(),
    hasNextPage: this.data.pageInfo.hasNextPage,
  })

  getParsedItems = (): Collection[] =>
    this.data.edges.map(CollectionDataParser.getParsedItem)

  private selectItemsTotal = () =>
    this.data.totalCount > ITEMS_OFFSET
      ? this.data.totalCount
      : this.getParsedCollections().length

  private shouldDisplayProduct = ({id}: Collection): boolean =>
    !this.collectionsIds.includes(id)

  getCollectionsIds = (): string[] =>
    this.getParsedCollections().map(({id}) => id)

  private static getDisplayLabel = (id: string) =>
    `${DisplayLabelPrefix.collectionID}: ${id}`

  private getParsedCollections = (): Collection[] =>
    uniqBy(
      this.data.edges
        .map<Collection>(CollectionDataParser.getParsedItem)
        .filter(this.shouldDisplayProduct),
      'id',
    )

  private static getParsedItem = ({
    node: {id, name, backgroundImage},
  }: ApiCollectionEdge): Collection => {
    return {
      id,
      name,
      image: backgroundImage?.url || '',
      displaySKU: CollectionDataParser.getDisplayLabel(id),
      sku: id,
    }
  }
}

export default CollectionDataParser
