import React, {Component} from 'react'
import {connect} from 'react-redux'

import {selectTerm} from '../../actions'

class TermList extends Component {
  constructor(props) {
    super(props)
    this.selectTerm = this.selectTerm.bind(this)
  }

  render() {
    return (
      <div> {
        this.props.termList.map((item, i) =>
          <div
            className={'list-group-item' + (this.props.isTermSelected(item) ? ' selected' : '') }
            key={i} onClick={()=>this.selectTerm(item)}>
            {item.wylie}
          </div>
        )
      }
      </div>
    )
  }

  selectTerm(term) {
    if (this.props.isTermSelected(term)) {
      return
    }
    this.props.dispatch(selectTerm(term))
  }
}

function select(state) {
  return {
    termList: state.searchState.result,
    isTermSelected: (term) =>
      state.selected.term && state.selected.term.wylie === term.wylie
  }
}

TermList.propTypes = {
  data: React.PropTypes.object
}

export default connect(select)(TermList)