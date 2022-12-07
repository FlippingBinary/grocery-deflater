import { GraphQLError } from 'graphql'
import { ProductListModel, VariantModel } from './db'
import {
  List,
  MutationAddToListArgs,
  QueryListArgs,
  RequireFields,
} from './generated/graphql'
import { encodeId, decodeId } from './utils'

/**
 * This resolver returns properties about a user's product list.
 * @param param0 An object containing a reference to query arguments
 * @returns
 */
export async function listResolver({
  args,
}: {
  args: Partial<QueryListArgs>
}): Promise<List> {
  const id = args?.filterBy?.id
  if (id !== undefined) {
    const listRecordId = decodeId(id)
    if (listRecordId === null)
      throw new GraphQLError('id of filterBy field is invalid')
    const list = await ProductListModel.findByPk(listRecordId.id)
    if (!list) return null

    return {
      id: encodeId({ scope: 'list', id: list.id }),
      name: list.name,
    }
  }
  const userId = args?.filterBy?.userId
  if (userId !== undefined) {
    const list = await ProductListModel.findOne({
      where: {
        ownerId: userId,
      },
    })
    if (!list) return null

    return {
      id: encodeId({ scope: 'list', id: list.id }),
      name: list.name,
    }
  }
  const name = args?.filterBy?.name
  if (name !== undefined) {
    const list = await ProductListModel.findOne({
      where: {
        name: name,
      },
    })
    if (!list) return null

    return {
      id: encodeId({ scope: 'list', id: list.id }),
      name: list.name,
    }
  }
}

/**
 * This mutation adds a product to a user's product list.
 * @param args An object containing `listId` and `productId`
 * @returns
 */
export async function addToListMutation(
  args: RequireFields<MutationAddToListArgs, 'input'>
): Promise<List> {
  const { listId: rawListId, productId: rawProductId } = args.input
  const listRecordId = decodeId(rawListId)
  if (listRecordId?.scope !== 'list')
    throw new GraphQLError('listId is invalid')
  const productRecordId = decodeId(rawProductId)
  if (productRecordId === null) throw new GraphQLError('productId is invalid')
  let productId: number
  if (productRecordId.scope === 'product') {
    // The product ID is of a generic product, so use it directly.
    productId = productRecordId.id
  } else if (productRecordId.scope === 'variant') {
    // The product ID is of a specific variant, so we need to lookup the generic product.
    const variant = await VariantModel.findByPk(productRecordId.id)
    if (!variant)
      throw new GraphQLError(
        'productId has variant scope but database has no record of it'
      )
    productId = variant.productId
  }
  const list = await ProductListModel.findByPk(listRecordId.id)
  if (!list) return null

  try {
    list.addItem(productId)
    await list.save()
  } catch (e) {
    throw new GraphQLError('Failed to add product to user list')
  }

  return {
    id: encodeId({ scope: 'list', id: list.id }),
    name: list.name,
  }
}
