import { GraphQLError } from 'graphql'
import { FindOptions, Op, WhereOptions } from 'sequelize'
import {
  CategoryModel,
  ProductListItemModel,
  ProductListModel,
  ProductModel,
  VariantModel,
} from './db'
import {
  Category,
  List,
  Merchant,
  MutationUpdateProductPriceArgs,
  Product,
  QueryProductsArgs,
  RequireFields,
} from './generated/graphql'
import { decodeId, encodeId } from './utils'

/**
 * The products resolver returns an array of GraphQL Product objects belonging to the parent object, if provided.
 * If the parent object is a merchant, the optional properties will be populated.
 * Warning: Do not supply more than one of the optional parameters merchant, category, or list.
 * @param param0 An object containing `args` and one of `merchant`, `category`, or `list`
 * @returns Product array
 */
export async function productsResolver({
  args,
  merchant,
  category,
  list,
}: {
  args: Partial<QueryProductsArgs>
  merchant?: Merchant
  category?: Category
  list?: List
}): Promise<Product[]> {
  const filterBy = args.filterBy
  let productId: number | undefined
  let categoryId: number[] | undefined
  let name: Record<symbol, string> | undefined

  // The filterBy options need to be collected in a way that is useful to the database queries.
  if (filterBy?.id !== undefined) {
    const productRecordId = decodeId(filterBy.id)
    if (productRecordId === null)
      throw new GraphQLError('id in filterBy query is invalid')
    if (productRecordId.scope !== 'product')
      throw new GraphQLError(
        `id in filterBy query uses invalid scope ${productRecordId.scope}`
      )
    productId = productRecordId.id
  }
  if (filterBy?.name?.startsWith !== undefined) {
    name = name ?? {}
    name[Op.startsWith] = filterBy.name.startsWith
  }
  if (filterBy?.name?.endsWith) {
    name = name ?? {}
    name[Op.endsWith] = filterBy.name.endsWith
  }
  if (filterBy?.name?.matches) {
    name = name ?? {}
    name[Op.eq] = filterBy.name.matches
  }
  if (filterBy?.categoryId !== undefined) {
    const categoryRecordId = decodeId(filterBy.categoryId.toString())
    if (categoryRecordId === null)
      throw new GraphQLError('categoryId in filterBy is invalid')
    if (categoryRecordId.scope !== 'category')
      throw new GraphQLError(
        `categoryId in filterBy uses invalid scope ${categoryRecordId.scope}`
      )
    categoryId = [categoryRecordId.id]
  } else if (filterBy?.category !== undefined) {
    const categorySearch: FindOptions<CategoryModel> = {}
    if (filterBy.category.startsWith !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} }
      categorySearch.where['name'][Op.startsWith] = filterBy.category.startsWith
    }
    if (filterBy.category.endsWith !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} }
      categorySearch.where['name'][Op.endsWith] = filterBy.category.endsWith
    }
    if (filterBy.category.matches !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} }
      categorySearch.where['name'][Op.eq] = filterBy.category.matches
    }
    const category = await CategoryModel.findAll(categorySearch)
    if (!!category) {
      categoryId = category.map((c) => c.id)
    }
  }

  if (list !== undefined) {
    // The parent object is a Merchant type in GraphQL, so we can provide location-specific info like price and weight.
    const listRecordId = decodeId(list.id)
    if (listRecordId?.scope !== 'list')
      throw new GraphQLError(
        `id of parent list uses invalid scope ${listRecordId.scope}, which should be impossible.`
      )
    const listId = listRecordId.id
    const where: WhereOptions<ProductListItemModel> = { productListId: listId }
    if (productId !== undefined) where.productId = productId
    if (name !== undefined) where['$product.Product_name$'] = name
    if (categoryId !== undefined)
      where['$product.Category_id$'] = {
        [Op.in]: categoryId,
      }
    const variants = await ProductListItemModel.findAll({
      where,
      include: [
        {
          model: ProductModel,
          as: 'product',
        },
      ],
    })

    // We have promised to return an array, according to our GraphQL Schema.
    if (!variants) return []

    return variants.map(
      (variant): Product => ({
        id: variant.id.toString(),
        name: variant.product.name,
        picture: variant.product.picture,
        categoryId: encodeId({
          scope: 'category',
          id: variant.product.categoryId,
        }),
      })
    )
  }

  if (merchant !== undefined) {
    // The parent object is a Merchant type in GraphQL, so we can provide location-specific info like price and weight.
    const locationRecordId = decodeId(merchant.id)
    if (locationRecordId?.scope !== 'location')
      throw new GraphQLError(
        `id of parent merchant uses invalid scope ${locationRecordId.scope}, which should be impossible.`
      )
    const locationId = locationRecordId.id
    const where: WhereOptions<VariantModel> = { locationId }
    if (productId !== undefined) where.id = productId
    if (name !== undefined) where['$product.Product_name$'] = name
    if (categoryId !== undefined)
      where['$product.Category_id$'] = {
        [Op.in]: categoryId,
      }
    const variants = await VariantModel.findAll({
      where,
      include: [
        {
          model: ProductModel,
          as: 'product',
        },
      ],
    })

    // We have promised to return an array, according to our GraphQL Schema.
    if (!variants) return []

    return variants.map(
      (variant): Product => ({
        id: encodeId({ scope: 'variant', id: variant.id }),
        name: variant.product.name,
        picture: variant.product.picture,
        price: variant.price,
        weight: variant.weight,
        categoryId: encodeId({
          scope: 'category',
          id: variant.product.categoryId,
        }),
        merchantId: encodeId({ scope: 'location', id: variant.locationId }),
      })
    )
  }

  if (category !== undefined) {
    // The parent type in GraphQL is a category, so we have to limit our search to that category even if the filterBy gives a wider range.
    const categoryRecordId = decodeId(category.id)
    if (categoryRecordId?.scope !== 'category')
      throw new GraphQLError(
        `id of parent category uses invalid scope ${categoryRecordId.scope}, which should be impossible.`
      )
    const thisCategoryId = categoryRecordId.id
    const where: WhereOptions<ProductModel> = {}
    if (productId !== undefined) where.id = productId
    if (name !== undefined) where.name = name
    if (categoryId !== undefined)
      where.categoryId = {
        [Op.in]: categoryId,
        [Op.eq]: thisCategoryId,
      }
    else where.categoryId = thisCategoryId
    const products = await ProductModel.findAll({
      where,
    })

    if (!products) return []

    return products.map(
      (product): Product => ({
        id: encodeId({ scope: 'product', id: product.id }),
        name: product.name,
        picture: product.picture,
        categoryId: encodeId({ scope: 'category', id: product.categoryId }),
      })
    )
  }

  if (list !== undefined) {
    // list refers to a unique ProductListModel, which has many ProductListItemModels, which each have one ProductModel.
    // It's a complicated relationship, but we have to get that third level of search
    const listRecordId = decodeId(list.id)
    if (listRecordId?.scope !== 'list')
      throw new GraphQLError(
        `id of parent list uses invalid scope ${listRecordId.scope}, which should be impossible.`
      )
    const listId = listRecordId.id
    const productList = await ProductListModel.findByPk(listId, {
      include: [
        {
          model: ProductListItemModel,
          as: 'items',
          include: [
            {
              model: ProductModel,
              as: 'product',
              where: {
                id: productId,
                name: {
                  [Op.startsWith]: name[Op.startsWith],
                  [Op.endsWith]: name[Op.endsWith],
                  [Op.eq]: name[Op.eq],
                },
                categoryId: {
                  [Op.in]: categoryId,
                },
              },
            },
          ],
        },
      ],
    })

    if (!productList) return []

    return productList.items.map((item) => ({
      id: encodeId({ scope: 'product', id: item.productId }),
      name: item.product.name,
      picture: item.product.picture,
      categoryId: encodeId({ scope: 'category', id: item.product.categoryId }),
    }))
  }

  const where: WhereOptions<ProductModel> = {}
  if (productId !== undefined) where.id = productId
  if (name !== undefined) where.name = name
  if (categoryId !== undefined) where.categoryId = categoryId
  const products = await ProductModel.findAll({
    where,
  })

  if (!products) return []

  return products.map(
    (product): Product => ({
      id: encodeId({ scope: 'product', id: product.id }),
      name: product.name,
      picture: product.picture,
      categoryId: encodeId({ scope: 'category', id: product.categoryId }),
    })
  )
}

export async function updateProductPriceMutation(
  args: RequireFields<MutationUpdateProductPriceArgs, 'input'>
): Promise<Product> {
  const {
    productId: rawProductId,
    merchantId: rawMerchantId,
    price,
  } = args.input
  const productRecordId = decodeId(rawProductId)
  if (productRecordId === null) throw new GraphQLError('productId is invalid')
  if (productRecordId.scope === 'product') {
    const locationRecordId = decodeId(rawMerchantId)
    if (locationRecordId?.scope !== 'location')
      throw new GraphQLError('merchantId is invalid')
    const variant = await VariantModel.findOne({
      where: {
        productId: productRecordId.id,
        locationId: locationRecordId.id,
      },
      include: [
        {
          model: ProductModel,
          as: 'product',
        },
      ],
    })
    if (!variant) return null

    variant.price = price
    try {
      await variant.save()
    } catch (e) {
      throw new GraphQLError('Failed to update product price in database')
    }

    return {
      id: encodeId({ scope: 'variant', id: variant.id }),
      name: variant.product.name,
      picture: variant.product.picture,
      price: variant.price,
      weight: variant.weight,
      categoryId: encodeId({
        scope: 'category',
        id: variant.product.categoryId,
      }),
      merchantId: encodeId({ scope: 'location', id: variant.locationId }),
    }
  } else if (productRecordId.scope === 'variant') {
    const variant = await VariantModel.findByPk(productRecordId.id, {
      include: [
        {
          model: ProductModel,
          as: 'product',
        },
      ],
    })
    if (!variant) return null

    variant.price = price
    try {
      await variant.save()
    } catch (e) {
      throw new GraphQLError('Failed to update product price in database')
    }

    return {
      id: encodeId({ scope: 'variant', id: variant.id }),
      name: variant.product.name,
      picture: variant.product.picture,
      price: variant.price,
      weight: variant.weight,
      categoryId: encodeId({
        scope: 'category',
        id: variant.product.categoryId,
      }),
      merchantId: encodeId({ scope: 'location', id: variant.locationId }),
    }
  }
  throw new GraphQLError(
    `productId used invalid scope ${productRecordId.scope}`
  )
}
