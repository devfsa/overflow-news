const paginationMeta = `
  total: Int
`;

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

type FeedsMeta {
  ${paginationMeta}
}

type PostsMeta {
  ${paginationMeta}
}

type Query {
  _allFeedsMeta: FeedsMeta
  _allPostsMeta: PostsMeta

  allFeeds(first: Int = 50, offset: Int = 0): [Feed]
  allPosts(first: Int = 50, offset: Int = 0): [Post]

  getFeed(id: ID): Feed!
  getPost(id: ID): Post!
}
`