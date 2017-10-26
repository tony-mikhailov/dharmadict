import React, {Component} from 'react'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

class NotFound extends Component {
  render () {
    return (
      <article>
        <h1 data-test-id="heading"><FormattedMessage id="NotFound.main_text" /></h1>
        <Link data-test-id="back_link" to='/' className='btn'><FormattedMessage id="NotFound.go_home" /></Link>
      </article>
    )
  }
}

export default NotFound
