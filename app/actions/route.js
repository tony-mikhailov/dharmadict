import {selectTerm} from './search'

import {
  CHANGE_ROUTE
} from './_constants'

export function changeRoute(location) {
  return (dispatch, getState) => {
    let state = getState()
    let prevLocation = state.route.location
    if(prevLocation && prevLocation.query.term !== location.query.term) {
      if(state.selected.term.id !== location.query.term) {
        let term = state.searchState.result.find(term => term.id === location.query.term)
        if(term) {
          dispatch(selectTerm(term))
        }
      }
    }
    return dispatch({
      type: CHANGE_ROUTE,
      location: location
    })
  }
}