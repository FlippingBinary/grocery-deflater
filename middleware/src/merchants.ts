import { GraphQLError } from 'graphql'
import { Op } from 'sequelize'
import { LocationModel, MerchantModel, VariantModel } from './db'
import { Merchant, Product, QueryMerchantsArgs } from './generated/graphql'
import { encodeId, decodeId } from './utils'

export async function merchantsResolver({
  args,
  product,
}: {
  args: Partial<QueryMerchantsArgs>
  product?: Product
}): Promise<Merchant[]> {
  const filterBy = args.filterBy
  if (!!filterBy?.id) {
    const recordId = decodeId(filterBy.id)
    if (recordId.scope !== 'location' || recordId.id === undefined) {
      throw new GraphQLError('id in filterBy is invalid')
    }
    const location = await LocationModel.findByPk(recordId.id, {
      include: [
        {
          model: MerchantModel,
          attributes: ['name'],
          as: 'merchant',
        },
      ],
    })
    if (!location) return null
    return [
      {
        id: encodeId({ scope: 'location', id: location.id }),
        name: location.merchant.name,
        location: {
          address: `${location.streetNumber} ${location.streetName}`,
          city: location.city,
          state: location.state,
          zip: location.zip.toString(),
        },
      },
    ]
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
            'id',
            'streetNumber',
            'streetName',
            'city',
            'state',
            'zip',
          ],
          as: 'locations',
        },
      ],
    }
    if (!!filterBy.name.startsWith) {
      merchantSearch.where.name[Op.startsWith] = filterBy.name.startsWith
    }
    if (!!filterBy.name.endsWith) {
      merchantSearch.where.name[Op.endsWith] = filterBy.name.endsWith
    }
    if (!!filterBy.name.matches) {
      merchantSearch.where.name[Op.eq] = filterBy.name.matches
    }
    const merchants = await MerchantModel.findAll(merchantSearch)
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: encodeId({ scope: 'location', id: location.id }),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat()
  } else if (!!filterBy?.location) {
    const merchantSearch = {
      where: {},
      include: [
        {
          model: LocationModel,
          attributes: [
            'id',
            'streetNumber',
            'streetName',
            'city',
            'state',
            'zip',
          ],
          as: 'locations',
        },
      ],
    } as any
    if (!!filterBy.location.address) {
      merchantSearch.where.streetName = merchantSearch.where.streetName ?? {}
      if (filterBy.location.address.startsWith !== undefined) {
        merchantSearch.where.streetName[Op.startsWith] =
          filterBy.location.address.startsWith
      }
      if (filterBy.location.address.endsWith !== undefined) {
        merchantSearch.where.streetName[Op.endsWith] =
          filterBy.location.address.endsWith
      }
      if (filterBy.location.address.matches !== undefined) {
        merchantSearch.where.streetName[Op.eq] =
          filterBy.location.address.matches
      }
    }
    if (!!filterBy.location.city) {
      merchantSearch.where.city = merchantSearch.where.city ?? {}
      if (filterBy.location.city.startsWith !== undefined) {
        merchantSearch.where.city[Op.startsWith] =
          filterBy.location.city.startsWith
      }
      if (filterBy.location.city.endsWith !== undefined) {
        merchantSearch.where.city[Op.endsWith] = filterBy.location.city.endsWith
      }
      if (filterBy.location.city.matches !== undefined) {
        merchantSearch.where.city[Op.eq] = filterBy.location.city.matches
      }
    }
    if (!!filterBy.location.state) {
      merchantSearch.where.state = merchantSearch.where.state ?? {}
      if (filterBy.location.state.startsWith !== undefined) {
        merchantSearch.where.state[Op.startsWith] =
          filterBy.location.state.startsWith
      }
      if (filterBy.location.state.endsWith !== undefined) {
        merchantSearch.where.state[Op.endsWith] =
          filterBy.location.state.endsWith
      }
      if (filterBy.location.state.matches !== undefined) {
        merchantSearch.where.state[Op.eq] = filterBy.location.state.matches
      }
    }
    if (!!filterBy.location.zip) {
      merchantSearch.where.zip = merchantSearch.where.zip ?? {}
      if (filterBy.location.zip.startsWith !== undefined) {
        merchantSearch.where.zip[Op.startsWith] =
          filterBy.location.zip.startsWith
      }
      if (filterBy.location.zip.endsWith !== undefined) {
        merchantSearch.where.zip[Op.endsWith] = filterBy.location.zip.endsWith
      }
      if (filterBy.location.zip.matches !== undefined) {
        merchantSearch.where.zip[Op.eq] = filterBy.location.zip.matches
      }
    }
    const merchants = await MerchantModel.findAll(merchantSearch)
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: encodeId({ scope: 'location', id: location.id }),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat()
  } else if (!!product) {
    // This is a query for the merchants that sell a particular product.
    const productRecordId = decodeId(product.id)
    if (productRecordId.scope === 'product') {
      // The parent product is generic. Return all merchants that sell it.
      const locations = await VariantModel.findAll({
        where: {
          productId: productRecordId.id,
        },
        include: [
          {
            model: LocationModel,
            attributes: [
              'id',
              'streetNumber',
              'streetName',
              'city',
              'state',
              'zip',
            ],
            as: 'location',
            include: [
              {
                model: MerchantModel,
                attributes: ['name'],
                as: 'merchant',
              },
            ],
          },
        ],
      })
      return locations.map((variant) => ({
        id: encodeId({ scope: 'location', id: variant.location.id }),
        name: variant.location.merchant.name,
        location: {
          address: `${variant.location.streetNumber} ${variant.location.streetName}`,
          city: variant.location.city,
          state: variant.location.state,
          zip: variant.location.zip.toString(),
        },
      }))
    } else if (productRecordId.scope === 'variant') {
      // The parent product is specific. Restrict locations to one.
      const variant = await VariantModel.findByPk(productRecordId.id, {
        include: [
          {
            model: LocationModel,
            attributes: [
              'id',
              'streetNumber',
              'streetName',
              'city',
              'state',
              'zip',
            ],
            as: 'location',
            include: [
              {
                model: MerchantModel,
                attributes: ['name'],
                as: 'merchant',
              },
            ],
          },
        ],
      })
      return [
        {
          id: encodeId({ scope: 'location', id: variant.location.id }),
          name: variant.location.merchant.name,
          location: {
            address: `${variant.location.streetNumber} ${variant.location.streetName}`,
            city: variant.location.city,
            state: variant.location.state,
            zip: variant.location.zip.toString(),
          },
        },
      ]
    }
    throw new GraphQLError(
      `The merchant's parent product id was encoded with an invalid scope ${productRecordId.scope}`
    )
  } else {
    const merchants = await MerchantModel.findAll({
      include: [
        {
          model: LocationModel,
          attributes: [
            'id',
            'streetNumber',
            'streetName',
            'city',
            'state',
            'zip',
          ],
          as: 'locations',
        },
      ],
    })
    if (!merchants) return null
    return merchants
      .map((merchant) =>
        merchant.locations.map((location) => ({
          id: encodeId({ scope: 'location', id: location.id }),
          name: merchant.name,
          location: {
            address: `${location.streetNumber} ${location.streetName}`,
            city: location.city,
            state: location.state,
            zip: location.zip.toString(),
          },
        }))
      )
      .flat()
  }
}
