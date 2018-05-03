import React from 'react';
import moment from 'moment'

const Post = ({ index, date, title, url, sourceName, sourceURL, categories = [] }) => (
  <li>
    <div className="title">
      <a href={url} target="_blank">
        {title}
      </a>
    </div>
    <div className="about">
      <span>By </span>
      <a href={sourceURL} target="_blank">{sourceName}</a>
      &nbsp;
      <span>{moment(new Date(date)).fromNow()}</span>
    </div>
    <div className="categories">
      <span>Categories: </span>
      <span>{categories.join(', ') || 'Uncategorized'}.</span>
    </div>
  </li>
)

export default Post
