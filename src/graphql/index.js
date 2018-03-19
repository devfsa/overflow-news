import { Router } from 'express'
import { buildSchema } from 'graphql'
import graphqlHTTP from 'express-graphql'
import schema from './schema'
import rootResolvers from './resolvers'

const router = new Router()

const rootSchema = buildSchema(schema)

router.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  rootValue: rootResolvers,
  graphiql: true,
}))

export default router