import React from 'react';

const Post = ({ index, date, title, url, sourceName, sourceURL, categories = [] }) => (
  <React.Fragment>
    <hr />

    <div className="footer">
      Made with <span className="heart">&lt;3</span> by <a href="https://twitter.com/di3goleite" target="_blank" rel="noopener noreferrer">@di3goleite</a> and <a href="https://twitter.com/Ro_DolfoSilva" target="_blank" rel="noopener noreferrer">@Ro_DolfoSilva</a>.
  </div>
  </React.Fragment>
)

export default Post
