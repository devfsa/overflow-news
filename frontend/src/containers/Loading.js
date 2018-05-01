import React, { Component } from 'react';
import LoadingComponent from '../components/Loading'

const nextPosition = (position, max, direction) => {
  if (direction < 0 && position <= 0) return 1
  if (direction > 0 && position >= max - 1) return max - 2
  return position + direction
}

const nextDirection = (position, max, direction) => {
  if (position <= 0 || position >= max - 1) return direction * -1
  return direction
}

class Loading extends Component {
  state = {
    position: 0,
    direction: 1,
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(({ position, direction }) => ({
        position: nextPosition(position, this.props.size, direction),
        direction: nextDirection(position, this.props.size, direction),
      }))
    }, 50)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { size = 60 } = this.props
    const characters = new Array(size).fill('\u00A0')

    return (<div class="loading-bar">[<LoadingComponent position={this.state.position} characters={characters} />]</div>)
  }
}

export default Loading;
