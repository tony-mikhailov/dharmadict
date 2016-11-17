import React, {Component} from 'react'
import {connect} from 'react-redux'

import {changeSearchString} from '../../actions'

class SearchInput extends Component {
  constructor (props) {
    super(props)
    this._onSearchStringChange = this._onSearchStringChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  render () {
    return (
        <div>
          <input className='search-input' name='search' type='text'
            value={this.props.data.searchString}
            onChange={this._onSearchStringChange}/>
          <button
            className='search-button'
            disabled={!this.props.data.searchString}
            onClick={this._onSubmit}>search</button>
        </div>
    )
  }

  _onSearchStringChange (event) {
    this.props.dispatch(changeSearchString(event.target.value))
  }

  _onSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.props.data.searchString)
  }
}

function select (state) {
  return {
    data: state.searchState
  }
}

SearchInput.propTypes = {
  data: React.PropTypes.object,
  onSubmit: React.PropTypes.func
}

export default connect(select)(SearchInput)
