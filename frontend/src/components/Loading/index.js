import React, { Component } from 'react'
import './style.css'

const Loading = ({ position, characters }) => (
  <React.Fragment>
    {characters.map((value, index) => (
      <span className={index === position ? 'loading--current' : undefined} key={index}>
        {index === position ? '=' : value}
      </span>)
    )}
  </React.Fragment>
)

export default Loading
