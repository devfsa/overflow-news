import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Pagination from '../components/Pagination'
import Post from '../components/Post'
import Layout from '../components/Layout'
import Loading from './Loading'
import { withRouter } from "react-router-dom";
const LINKS_PER_PAGE = 30

let Posts = ({ match: { params: { page = 1 } }, data: { allPosts, _allPostsMeta, loading } }) => {
  return (
    <Layout>
      {loading && <Loading size={20} />}
      <ol className="posts">
        {!loading && allPosts.map((todo, i) => <Post key={todo.id} index={i + 1} {...todo} />)}
      </ol>

      <Pagination currentPage={Number(page)} perPage={LINKS_PER_PAGE} totalItems={_allPostsMeta ? _allPostsMeta.total : 0} />
    </Layout>
  )
}

const POSTS_QUERY = gql`
  query PostsQuery($offset: Int, $first: Int) {
    _allPostsMeta {
      total
    }
    allPosts(offset: $offset, first: $first) {
      id
      title
      url
      date
      sourceURL
      sourceName
      categories
    }
  }
`

Posts = withRouter(graphql(POSTS_QUERY, {
  fetchPolicy: 'cache-and-network',
  options: ({ match: { params } }) => {
    let page = parseInt(params.page || 1, 10)
    const offset = (page - 1) * LINKS_PER_PAGE
    return {
      variables: { first: LINKS_PER_PAGE, offset },
    }
  }
})(Posts));

export default Posts
