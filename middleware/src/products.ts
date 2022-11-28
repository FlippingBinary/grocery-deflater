import { GraphQLError } from "graphql";
import { FindOptions, InferAttributes, Op, WhereOptions } from "sequelize";
import {
  CategoryModel,
  LocationModel,
  ProductListItemModel,
  ProductListModel,
  ProductModel,
  VariantModel,
} from "./db";
import {
  Category,
  List,
  Merchant,
  MutationUpdateProductPriceArgs,
  Product,
  QueryProductsArgs,
  RequireFields,
} from "./generated/graphql";

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
  args: Partial<QueryProductsArgs>;
  merchant?: Merchant;
  category?: Category;
  list?: List;
}): Promise<Product[]> {
  const filterBy = args.filterBy;

  if (list?.products?.length) {
    // The products are already in this list, so just filter them.
    // This is a shortcut that prevents additional queries of the database
    return list.products.filter((product) => {
      if (
        !!filterBy.category?.endsWith &&
        !product.category.name.endsWith(filterBy.category.endsWith)
      )
        return false;
      if (
        !!filterBy.category?.matches &&
        !product.category.name.match(filterBy.category.matches)
      )
        return false;
      if (
        !!filterBy.category?.startsWith &&
        !product.category.name.startsWith(filterBy.category.startsWith)
      )
        return false;
      if (
        !!filterBy.categoryId &&
        parseInt(product.categoryId) !== filterBy.categoryId
      )
        return false;
      if (!!filterBy.id && product.id !== filterBy.id) return false;
      if (
        !!filterBy.name?.endsWith &&
        !product.name.endsWith(filterBy.name.endsWith)
      )
        return false;
      if (
        !!filterBy.name?.matches &&
        !product.name.match(filterBy.name.matches)
      )
        return false;
      if (
        !!filterBy.name?.startsWith &&
        !product.name.startsWith(filterBy.name.startsWith)
      )
        return false;
    });
  }

  let productId: number | undefined;
  let categoryId: number[] | undefined;
  let name: Record<symbol, string> | undefined;

  // The filterBy options need to be collected in a way that is useful to the database queries.
  if (filterBy?.id !== undefined) {
    productId = parseInt(filterBy.id);
  }
  if (filterBy?.name?.startsWith !== undefined) {
    name = name ?? {};
    name[Op.startsWith] = filterBy.name.startsWith;
  }
  if (filterBy?.name?.endsWith) {
    name = name ?? {};
    name[Op.endsWith] = filterBy.name.endsWith;
  }
  if (filterBy?.name?.matches) {
    name = name ?? {};
    name[Op.eq] = filterBy.name.matches;
  }
  if (filterBy?.categoryId !== undefined) {
    categoryId = [filterBy.categoryId];
  } else if (filterBy?.category !== undefined) {
    const categorySearch: FindOptions<CategoryModel> = {};
    if (filterBy.category.startsWith !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} };
      categorySearch.where["name"][Op.startsWith] =
        filterBy.category.startsWith;
    }
    if (filterBy.category.endsWith !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} };
      categorySearch.where["name"][Op.endsWith] = filterBy.category.endsWith;
    }
    if (filterBy.category.matches !== undefined) {
      categorySearch.where = categorySearch.where ?? { name: {} };
      categorySearch.where["name"][Op.eq] = filterBy.category.matches;
    }
    const category = await CategoryModel.findAll(categorySearch);
    if (!!category) {
      categoryId = category.map((c) => c.id);
    }
  }

  if (merchant !== undefined) {
    // The parent object is a Merchant type in GraphQL, so we can provide location-specific info like price and weight.
    const locationId = parseInt(merchant.id);
    const where: WhereOptions<VariantModel> = { locationId };
    if (productId !== undefined) where.productId = productId;
    if (name !== undefined) where["$product.name$"] = name;
    if (categoryId !== undefined)
      where["$product.Category_id$"] = {
        [Op.in]: categoryId,
      };
    const variants = await VariantModel.findAll({
      where,
      include: [
        {
          model: ProductModel,
          as: "product",
        },
      ],
    });

    // We have promised to return an array, according to our GraphQL Schema.
    if (!variants) return [];

    return variants.map(
      (variant): Product => ({
        id: variant.id.toString(),
        name: variant.product.name,
        picture: variant.product.picture,
        price: variant.price,
        weight: variant.weight,
        categoryId: variant.product.categoryId?.toString() ?? "categoryId",
        merchantId: variant.locationId?.toString() ?? "merchantId",
      })
    );
  }

  if (category !== undefined) {
    // The parent type in GraphQL is a category, so we have to limit our search to that category even if the filterBy gives a wider range.
    const thisCategoryId = parseInt(category.id);
    const where: WhereOptions<ProductModel> = {};
    if (productId !== undefined) where.id = productId;
    if (name !== undefined) where.name = name;
    if (categoryId !== undefined)
      where.categoryId = {
        [Op.in]: categoryId,
        [Op.eq]: thisCategoryId,
      };
    else where.categoryId = thisCategoryId;
    const products = await ProductModel.findAll({
      where,
    });

    if (!products) return [];

    return products.map(
      (product): Product => ({
        id: product.id.toString(),
        name: product.name,
        picture: product.picture,
        categoryId: product.categoryId.toString(),
      })
    );
  }

  if (list !== undefined) {
    // list refers to a unique ProductListModel, which has many ProductListItemModels, which each have one ProductModel.
    // It's a complicated relationship, but we have to get that third level of search
    const listId = parseInt(list.id);
    const productList = await ProductListModel.findByPk(listId, {
      include: [
        {
          model: ProductListItemModel,
          as: "items",
          include: [
            {
              model: ProductModel,
              as: "product",
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
    });

    if (!productList) return [];

    return productList.items.map((item) => ({
      id: item.productId.toString(),
      name: item.product.name,
      picture: item.product.picture,
      categoryId: item.product.categoryId.toString(),
    }));
  }
}

export async function updateProductPriceMutation(
  args: RequireFields<MutationUpdateProductPriceArgs, "input">
): Promise<Product> {
  const { productId, price } = args.input;
  const variant = await VariantModel.findByPk(parseInt(productId), {
    include: [
      {
        model: ProductModel,
        attributes: ["name"],
        as: "product",
      },
    ],
  });
  if (!variant) return null;

  variant.price = price;
  try {
    await variant.save();
  } catch (e) {
    throw new GraphQLError(e);
  }

  return {
    id: variant.id.toString(),
    name: variant.product.name,
    picture: variant.product.picture,
    price: variant.price,
    weight: variant.weight,
    categoryId: variant.product.categoryId.toString(),
    merchantId: variant.locationId.toString(),
  };
}
