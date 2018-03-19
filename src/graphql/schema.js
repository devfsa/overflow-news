export default `
type Feed {
  id: ID!
  rss: String
  url: String
  title: String
  date: String
}

type Post {
  id: ID!
  sourceName: String
  sourceURL: String
  title: String
  date: String
  author: String
  url: String
  categories: [String]
}

type Query {
  allFeeds: [Feed]
  allPosts: [Post]
}
`