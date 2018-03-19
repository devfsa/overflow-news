import { Post, Feed } from '../models'

export default {
  Query: {
    _allFeedsMeta: () => ({ total: Feed.count({}) }),
    _allPostsMeta: () => ({ total: Post.count({}) }),

    allFeeds: (root, { first, offset }) => Feed.find({}).skip(offset).limit(first).exec(),
    allPosts: (root, { first, offset }) => Post.find({}).skip(offset).limit(first).exec(),

    getFeed: (root, { id }) => Feed.findOne({ _id: id }),
    getPost: (root, { id }) => Post.findOne({ _id: id }),
  }
}
