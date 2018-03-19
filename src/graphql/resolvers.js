import { Post, Feed } from '../models'

export default {
  allFeeds: () => Feed.find({}),
  allPosts: () => Post.find({})
}