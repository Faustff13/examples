'use strict'

import deepClone from 'libs/deep-clone'

const initialState = {
  hidden: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'GET_HIDDEN_CONVERSATIONS': {
      state = deepClone(state)

      state.hidden = action.localStorage

      return state
    }
    case 'SET_HIDDEN_CONVERSATIONS': {
      state = deepClone(state)

      state.hidden = Array.from(new Set(state.hidden.concat(action.hideConversations)))

      return state
    }
    default: {
      return state
    }
  }
}
