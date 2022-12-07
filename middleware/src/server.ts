import { readFileSync } from 'fs'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda' //highlight-line
import { productsResolver, updateProductPriceMutation } from './products'
import { merchantsResolver } from './merchants'
import { Resolvers } from './generated/graphql'
import { loadSequelize } from './db'
import { GraphQLScalarType, Kind } from 'graphql'
import { Sequelize } from 'sequelize'
import { categoriesResolver } from './categories'
import { listResolver, addToListMutation } from './list'
import { userResolver } from './user'

const dateScalar = new GraphQLScalarType<Date, number>({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: Date) {
    return value.getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value: number) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10))
    }
    // Invalid hard-coded value (not an integer)
    return null
  },
})

const typeDefs = readFileSync('src/schema.graphql', { encoding: 'utf-8' })

const resolvers: Resolvers = {
  Date: dateScalar,
  Query: {
    categories: async (_, args) => await categoriesResolver({ args }),
    products: async (_, args) => await productsResolver({ args }),
    merchants: async (_, args) => await merchantsResolver({ args }),
    list: async (_, args) => await listResolver({ args }),
    user: async (_, email) => await userResolver(email),
  },
  Category: {
    products: async (category, args) =>
      await productsResolver({ args, category }),
  },
  List: {
    products: async (list, args) => await productsResolver({ args, list }),
  },
  Merchant: {
    products: async (merchant, args) =>
      await productsResolver({ args, merchant }),
  },
  Product: {
    category: async (product) =>
      (await categoriesResolver({ product, args: {} }))[0],
    merchant: async (product) =>
      (await merchantsResolver({ product, args: {} }))[0],
    merchants: async (product, args) =>
      await merchantsResolver({ product, args }),
  },
  Mutation: {
    updateProductPrice: async (_, args) =>
      await updateProductPriceMutation(args),
    addToList: async (_, args) => await addToListMutation(args),
  },
}

interface GroverContext {
  sequelize: Sequelize
}

const server = new ApolloServer<GroverContext>({
  typeDefs,
  resolvers,
})

// This final export is important!
export const graphqlHandler = startServerAndCreateLambdaHandler<GroverContext>(
  server,
  {
    context: async () => ({
      sequelize: await loadSequelize(),
    }),
  }
)
