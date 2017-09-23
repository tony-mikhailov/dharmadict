import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'

import {changeWylie, saveTermAsync, changeSanskrit} from '../../actions/admin/newTerm'

class NewTerm extends Component {
  constructor (props) {
    super(props)
    this._onWylieChange = this._onWylieChange.bind(this)
    this._onSanskritChange = this._onSanskritChange.bind(this)
    this._onTermSave = this._onTermSave.bind(this)
  }

  render () {
    const {error, pending, wylie, termId, sanskrit} = this.props.data
    const {languages} = this.props
    return (
      <div>
        <h3>{'Новый термин'}</h3>
        <form className="col-md-6">
          <div className="form-group">
            <input className="form-control"
              name="wylie"
              type="text"
              placeholder="wylie"
              value={wylie}
              onChange={this._onWylieChange}/>
          </div>
          {
            languages && languages.map(lang =>
              <div className="form-group" key={lang.id}>
                <input
                  className="form-control"
                  name={lang.id}
                  type="text"
                  placeholder={'sanskrit ' + lang.name}
                  value={sanskrit['sanskrit_' + lang.id] || ''}
                  onChange={(event) => this._onSanskritChange(event, 'sanskrit_' + lang.id)}
                />
              </div>
            )
          }
          <div className="form-group">
            <Button
              bsStyle='primary'
              type="button"
              className={pending ? 'loader' : ''}
              disabled={this.disabled()}
              onClick={(event) => this._onTermSave(event)}
            >{'Сохранить'}</Button>
            <Link to={`/`}>{'Отмена'}</Link>
          </div>
          {error && <div className="alert alert-danger col-md-6">{error.message}</div>}
          {!error && termId && <div className="alert alert-success col-md-6">{`Term was created with id: ${termId}`}</div>}
        </form>
      </div>
    )
  }

  isSanskritOk () {
    const {sanskrit} = this.props.data
    return this.props.languages.length ===
      Object.keys(sanskrit).reduce((result, key) => result + !!sanskrit[key], 0)
  }

  disabled () {
    const {pending, wylie} = this.props.data
    return !wylie || pending || !this.isSanskritOk()
  }

  _onWylieChange (event) {
    this.props.dispatch(changeWylie(event.target.value))
  }

  _onSanskritChange (event, sanskritType) {
    this.props.dispatch(changeSanskrit(sanskritType, event.target.value))
  }

  _onTermSave (event) {
    this.props.dispatch(saveTermAsync())
  }
}

function select (state) {
  return {
    data: state.admin.newTerm,
    languages: state.common.languages
  }
}

export default connect(select)(NewTerm)
