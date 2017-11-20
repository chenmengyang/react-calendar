import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DayElement extends Component {
  static propTypes = {
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    day: PropTypes.number,
    extraClass: PropTypes.string,
    empty: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = {
      hovering: false,
    }
    this.setHover = this.setHover.bind(this);
  }

  setHover(status) {
    if (this.props.onHover) {
      this.props.onHover();
    }
    this.setState({
      hovering: status,
    });
  }

  render() {
    if (this.props.empty) {
      return <li></li>
    }
    return (
      <li className={`${this.props.extraClass}`} onMouseEnter={()=>this.setHover(true)} onMouseLeave={()=>this.setHover(false)}>
        <span className={`${this.state.hovering?'hovering':''}`} onClick={this.props.onClick}>
          {this.props.day ? this.props.day : ''}
        </span>
      </li>
    )
  }
}

export default DayElement;