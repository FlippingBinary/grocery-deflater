import { GraphQLError } from 'graphql'
import { Op } from 'sequelize'
import { CategoryModel } from './db'
import { Category, Product, QueryCategoriesArgs } from './generated/graphql'
import { encodeId, decodeId } from './utils'

export async function categoriesResolver({
  args,
  product,
}: {
  args: Partial<QueryCategoriesArgs>
  product?: Product
}): Promise<Category[]> {
  const filterBy = args.filterBy
  if (product !== undefined) {
    if (filterBy !== undefined) {
      throw new GraphQLError('Cannot filter categories inside products because products have only one category (for now).')
    }
    if (product.categoryId !== undefined) {
      // We know the category ID, so we can use that to identify it.
      const categoryRecordId = decodeId(product.categoryId)
      if (categoryRecordId === null || categoryRecordId.scope !== 'category')
        throw new GraphQLError('categoryId of product is invalid')
      const category = await CategoryModel.findByPk(categoryRecordId.id)
      return [
        {
          id: encodeId({ scope: 'category', id: category.id }),
          name: category.name,
          description: category.description,
        },
      ]
    } else {
      // The category's ID is undefined, just throw an error.
      throw new GraphQLError('The category of a product was requested, but the categoryId is undefined. This should not be possible.')
    }
  }
  const categorySearch = {} as any
  if (!!filterBy?.name) {
    categorySearch.where = categorySearch.where ?? {}
    categorySearch.where.name = {}
    if (filterBy.name.startsWith !== undefined) {
      categorySearch.where.name[Op.startsWith] = filterBy.name.startsWith
    }
    if (filterBy.name.endsWith !== undefined) {
      categorySearch.where.name[Op.endsWith] = filterBy.name.endsWith
    }
    if (filterBy.name.matches !== undefined) {
      categorySearch.where.name[Op.eq] = filterBy.name.matches
    }
  }
  if (!!filterBy?.id) {
    const categoryRecordId = decodeId(filterBy.id)
    if (categoryRecordId === null)
      throw new GraphQLError('id in filterBy field is invalid')
    categorySearch.where = categorySearch.where ?? {}
    categorySearch.where.id = categoryRecordId.id
  }
  if (!!filterBy?.description) {
    categorySearch.where = categorySearch.where ?? {}
    categorySearch.where.description = {}
    if (filterBy.description.startsWith !== undefined) {
      categorySearch.where.description[Op.startsWith] =
        filterBy.description.startsWith
    }
    if (filterBy.description.endsWith !== undefined) {
      categorySearch.where.description[Op.endsWith] =
        filterBy.description.endsWith
    }
    if (filterBy.description.matches !== undefined) {
      categorySearch.where.description[Op.eq] = filterBy.description.matches
    }
  }
  const categories = await CategoryModel.findAll(categorySearch)
  return categories.map(
    (category): Category => ({
      id: encodeId({ scope: 'category', id: category.id }),
      name: category.name,
      description: category.description,
    })
  )
}
