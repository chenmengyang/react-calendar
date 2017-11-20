import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DayElement extends Component {
  static propTypes = {
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    day: PropTypes.number,
    extraClass: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      hovering: false,
    }
    this.setHover = this.setHover.bind(this);
  }

  setHover(status) {
    this.setState({
      hovering: status,
    });
  }

  render() {
    return (
      <li className={`${this.props.extraClass}`} onMouseEnter={()=>this.setHover(true)} onMouseLeave={()=>this.setHover(false)}>
        <span className={`${this.state.hovering?'hovering':''}`} onClick={this.props.onClick} onMouseEnter={this.props.onHover}>
          {this.props.day ? this.props.day : ''}
        </span>
      </li>
    )
  }
}

export default DayElement;