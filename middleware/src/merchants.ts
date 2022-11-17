import { Op } from "sequelize";
import { LocationModel, MerchantModel, ProductModel, VariantModel } from "./db";
import {
  Merchant,
  Product,
  ProductMerchantsArgs,
  QueryMerchantsArgs,
} from "./generated/graphql";

export async function merchantsResolver({
  args,
  product,
}: {
  args: Partial<QueryMerchantsArgs>;
  product?: Product;
}): Promise<Merchant[]> {
  console.log('Starting merchantsResolver');
  const filterBy = args.filterBy;
  if (!!filterBy?.id) {
    const location = await LocationModel.findByPk(filterBy.id, {
      include: [
        {
          model: MerchantModel,
          attributes: ["name"],
          as: "merchant",
        },
      ],
    });
    if (!location) return null;
    return [
      {
        id: location.id.toString(),
        name: location.merchant.name,
        location: {
          address: `${location.streetNumber} ${location.streetName}`,
          city: location.city,
          state: location.state,
          zip: location.zip.toString(),
        },
      },
    ];
  } else if (!!filterBy?.name) {
    // Search for merchants by name
    const merchantSearch = {
      where: {
        name: {},
      },
      include: [
        {
          model: LocationModel,
          attributes: [
            "id",
            "streetNumber",
            "streetName",
            "city",
            "state",
            "zip",
          ],
          as: "locations",
        },
      ],
    };
    if (!!filterBy.name.startsWith) {
      merchantSearch.where.name[Op.startsWith] = filterBy.name.startsWith;
    }
    if (!!filterBy.name.endsWith) {
      merchantSearch.where.name[Op.endsWith] = filterBy.name.endsWith;
    }
    if (!!filterBy.name.matches) {
      merchantSearch.where.name[Op.eq] = filterBy.name.matches;
    }
    const merchants = await MerchantModel.findAll(merchantSearch);
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: location.id.toString(),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat();
  } else if (!!filterBy?.location) {
    const merchantSearch = {
      where: {},
      include: [
        {
          model: LocationModel,
          attributes: [
            "id",
            "streetNumber",
            "streetName",
            "city",
            "state",
            "zip",
          ],
          as: "locations",
        },
      ],
    } as any;
    if (!!filterBy.location.address) {
      merchantSearch.where.streetName = merchantSearch.where.streetName ?? {};
      if (filterBy.location.address.startsWith !== undefined) {
        merchantSearch.where.streetName[Op.startsWith] =
          filterBy.location.address.startsWith;
      }
      if (filterBy.location.address.endsWith !== undefined) {
        merchantSearch.where.streetName[Op.endsWith] =
          filterBy.location.address.endsWith;
      }
      if (filterBy.location.address.matches !== undefined) {
        merchantSearch.where.streetName[Op.eq] =
          filterBy.location.address.matches;
      }
    }
    if (!!filterBy.location.city) {
      merchantSearch.where.city = merchantSearch.where.city ?? {};
      if (filterBy.location.city.startsWith !== undefined) {
        merchantSearch.where.city[Op.startsWith] =
          filterBy.location.city.startsWith;
      }
      if (filterBy.location.city.endsWith !== undefined) {
        merchantSearch.where.city[Op.endsWith] =
          filterBy.location.city.endsWith;
      }
      if (filterBy.location.city.matches !== undefined) {
        merchantSearch.where.city[Op.eq] = filterBy.location.city.matches;
      }
    }
    if (!!filterBy.location.state) {
      merchantSearch.where.state = merchantSearch.where.state ?? {};
      if (filterBy.location.state.startsWith !== undefined) {
        merchantSearch.where.state[Op.startsWith] =
          filterBy.location.state.startsWith;
      }
      if (filterBy.location.state.endsWith !== undefined) {
        merchantSearch.where.state[Op.endsWith] =
          filterBy.location.state.endsWith;
      }
      if (filterBy.location.state.matches !== undefined) {
        merchantSearch.where.state[Op.eq] = filterBy.location.state.matches;
      }
    }
    if (!!filterBy.location.zip) {
      merchantSearch.where.zip = merchantSearch.where.zip ?? {};
      if (filterBy.location.zip.startsWith !== undefined) {
        merchantSearch.where.zip[Op.startsWith] =
          filterBy.location.zip.startsWith;
      }
      if (filterBy.location.zip.endsWith !== undefined) {
        merchantSearch.where.zip[Op.endsWith] = filterBy.location.zip.endsWith;
      }
      if (filterBy.location.zip.matches !== undefined) {
        merchantSearch.where.zip[Op.eq] = filterBy.location.zip.matches;
      }
    }
    const merchants = await MerchantModel.findAll(merchantSearch);
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: location.id.toString(),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat();
  } else if (!!product) {
    // This is a query for the merchants that sell a particular product.
    const variant = await VariantModel.findByPk(product.id, {
      include: [
        {
          model: ProductModel,
          attributes: ["id"],
          as: "product",
        },
      ],
    });
    if (!variant) return null;
    const locations = await VariantModel.findAll({
      where: {
        productId: variant.product.id,
      },
      include: [
        {
          model: LocationModel,
          attributes: [
            "id",
            "streetNumber",
            "streetName",
            "city",
            "state",
            "zip",
          ],
          as: "location",
          include: [
            {
              model: MerchantModel,
              attributes: ["name"],
              as: "merchant",
            },
          ],
        },
      ],
    });
    return locations.map((variant) => ({
      id: variant.location.id.toString(),
      name: variant.location.merchant.name,
      location: {
        address: `${variant.location.streetNumber} ${variant.location.streetName}`,
        city: variant.location.city,
        state: variant.location.state,
        zip: variant.location.zip.toString(),
      },
    }));
  } else {
    const merchants = await MerchantModel.findAll({
      include: [
        {
          model: LocationModel,
          attributes: [
            "id",
            "streetNumber",
            "streetName",
            "city",
            "state",
            "zip",
          ],
          as: "locations",
        },
      ],
    });
    if (!merchants) return null;
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: location.id.toString(),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat();
  }
}

export async function merchantResolver({
  product,
}: {
  product: Product;
}): Promise<Merchant> {
  console.log("Starting merchantResolver");
  const variant = await VariantModel.findByPk(parseInt(product.id), {
    include: [
      {
        model: LocationModel,
        attributes: [
          "id",
          "streetNumber",
          "streetName",
          "city",
          "state",
          "zip",
        ],
        as: "location",
        include: [
          {
            model: MerchantModel,
            attributes: ["name"],
            as: "merchant",
          },
        ],
      },
    ],
  });

  if (!variant) {
    return null;
  }

  return {
    id: variant.locationId.toString(),
    name: variant.location.merchant.name,
    location: {
      address: `${variant.location.streetNumber} ${variant.location.streetName}`,
      city: variant.location.city,
      state: variant.location.state,
      zip: variant.location.zip.toString(),
    },
  };
}
