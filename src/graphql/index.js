import { Router } from 'express'
import { makeExecutableSchema } from 'graphql-tools';
import graphqlHTTP from 'express-graphql'
import typeDefs from './schema'
import resolvers from './resolvers'

const router = new Router()

const rootSchema = makeExecutableSchema({ typeDefs, resolvers })

router.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  graphiql: true,
}))

export default router