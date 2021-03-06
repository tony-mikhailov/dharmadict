import React, {Component} from 'react'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

class NotFound extends Component {
  render () {
    return (
      <article data-test-id="NotFound">
        <h1><FormattedMessage id="NotFound.main_text" /></h1>
        <Link className="btn" to='/'>
          <FormattedMessage id="NotFound.go_home" />
        </Link>
      </article>
    )
  }
}

export default NotFound
