import { GraphQLError } from "graphql";
import { Op } from "sequelize";
import { CategoryModel, LocationModel, ProductModel, VariantModel } from "./db";
import {
  Category,
  Merchant,
  MutationUpdateProductPriceArgs,
  Product,
  QueryProductsArgs,
  RequireFields,
} from "./generated/graphql";

export async function productsResolver({
  args,
  merchant,
  category,
}: {
  args: Partial<QueryProductsArgs>;
  merchant?: Merchant;
  category?: Category;
}) {
  const filterBy = args.filterBy;
  const variantSearch = {
    include: [
      {
        model: ProductModel,
        attributes: ["name", "categoryId"],
        as: "product",
      },
    ],
  } as any;
  if (!!merchant) {
    variantSearch.where = variantSearch.where ?? {};
    variantSearch.where.locationId = parseInt(merchant.id);
  }
  if (!!category) {
    const products = await ProductModel.findAll({
      where: {
        categoryId: category.id,
      },
    });
    if (!!products) {
      variantSearch.where = variantSearch.where ?? {};
      variantSearch.where.productId = {
        [Op.in]: products.map((product) => product.id),
      };
    }
  }
  if (!!filterBy) {
    if (!!filterBy.id) {
      variantSearch.where.id = filterBy.id;
    }
    if (!!filterBy?.name || !!filterBy?.category || !!filterBy?.categoryId) {
      const productSearch = {} as any;
      if (!!filterBy.name) {
        productSearch.where = productSearch.where ?? {};
        productSearch.where.name = productSearch.where.name ?? {};
        if (!!filterBy.name.startsWith) {
          productSearch.where.name[Op.startsWith] = filterBy.name.startsWith;
        }
        if (!!filterBy.name.endsWith) {
          productSearch.where.name[Op.endsWith] = filterBy.name.endsWith;
        }
        if (!!filterBy.name.matches) {
          productSearch.where.name[Op.eq] = filterBy.name.matches;
        }
      }
      if (!!filterBy.categoryId) {
        productSearch.where = productSearch.where ?? {};
        productSearch.where.categoryId = filterBy.categoryId;
      } else if (!!filterBy.category) {
        const categorySearch = {
          where: {
            name: {},
          },
        };
        if (!!filterBy.category.startsWith) {
          categorySearch.where.name[Op.startsWith] =
            filterBy.category.startsWith;
        }
        if (!!filterBy.category.endsWith) {
          categorySearch.where.name[Op.endsWith] = filterBy.category.endsWith;
        }
        if (!!filterBy.category.matches) {
          categorySearch.where.name[Op.eq] = filterBy.category.matches;
        }
        const category = await CategoryModel.findOne(categorySearch);
        if (!!category) {
          productSearch.where = productSearch.where ?? {};
          productSearch.where.categoryId = category.id;
        }
      }
      const products = await ProductModel.findAll(productSearch);
      if (!!products) {
        variantSearch.where = variantSearch.where ?? {};
        variantSearch.where.productId = {
          [Op.in]: products.map((product) => product.id),
        };
      }
    }
  }
  const variants = await VariantModel.findAll(variantSearch);

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
