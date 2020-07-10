'use strict'

/* global CSSPREF */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isNumber from 'lodash/isNumber'
import Snippet from 'containers/mnh-snippet'
import { showAppBadge, showAppBorderlessChat, showConversation, showConversations } from 'actions/app'
import { sendGAEvent } from '../../google-analytics'
import { snippetsConversationsSelector } from '../../selectors/Conversations'
import { addHiddenConversations } from '../../actions/conversations'

import './styles'


export default function SnippetsList() {
  const dispatch = useDispatch()

  const conversations = useSelector(snippetsConversationsSelector)
  const is_mobile = useSelector(state => state.app.is_mobile)
  const showBadge = useSelector(state => state.app.show_badge)
  const show_borderless_chat = useSelector(state => state.app.show_borderless_chat)
  const unread = useSelector(state => !!state.conversations.unread)
  const messenger_padding_horizontal = useSelector(state => state.config.messenger_padding_horizontal)
  const messenger_padding_vertical = useSelector(state => state.config.messenger_padding_vertical)
  const messenger_position = useSelector(state => state.config.messenger_position)

  const [snippet, setSnippet] = useState(false)
  const [notInStack, setNotInStack] = useState(false)
  const [updateTransitionSnippet, setUpdateTransitionSnippet] = useState(0)

  const preparingOfConversations = useMemo(() => {
    return conversations.slice(0, 3)
  }, [conversations, updateTransitionSnippet])

  const updateTransitions = useCallback(() => {
    setUpdateTransitionSnippet(preparingOfConversations.length)

    return !!updateTransitionSnippet
  }, [updateTransitionSnippet, conversations])

  const hideSnippets = useCallback(() => {
    console.log('onclick', conversations)
    dispatch(addHiddenConversations(conversations))
  }, [conversations, dispatch])

  const clearMessages = useCallback(() => {
    sendGAEvent('Click', 'Cleared all')

    setSnippet(false)
    hideSnippets()
    updateTransitions()
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!is_mobile) {
      setNotInStack(true)
    }
  }, [is_mobile])

  const handleMouseLeave = useCallback(() => {
    if (!is_mobile) {
      setNotInStack(false)
    }
  }, [is_mobile])

  const handleOnClickSnippets = useCallback((event) => {
    event.stopPropagation()

    if (is_mobile) {
      setNotInStack(true)
    }
  }, [is_mobile])

  const openConversationsList = useCallback(() => {
    dispatch(showAppBadge())
    dispatch(showConversations())
  }, [dispatch])

  const handleViewMoreOnClick = useCallback(() => {
    sendGAEvent('Click', 'Viewed more')

    return openConversationsList()
  }, [])

  const showOnlyFocusedSnippet = useCallback((cnt) => {
    if (isNumber(cnt)) {
      setSnippet(cnt)

      if (preparingOfConversations[cnt].message_style === 3) {
        dispatch(showConversation(preparingOfConversations[cnt].conversation_id))
        dispatch(showAppBorderlessChat())
      }
    } else {
      setSnippet(false)
    }
  }, [dispatch, conversations])

  const makeSnippets = useMemo(() => {
    if (show_borderless_chat) return null

    if (Object.keys(conversations).length === 0) return null

    if (!unread) return null
    let messages = []
    const numberSnippet = isNumber(snippet)
    const styleOfMessages = preparingOfConversations.length > 1 ? 1 : 0
    const snippets = []
    const updateTransition = updateTransitions()

    if (numberSnippet) {
      messages = [preparingOfConversations[snippet]]
    } else {
      messages = preparingOfConversations
    }

    messages.forEach((value, index) => {
      snippets.push(
        <Snippet
          updateTransition={updateTransition}
          message={numberSnippet ? messages[index] : value}
          key={numberSnippet ? 0 : index}
          keyProp={numberSnippet ? 0 : index}
          isLastSnippet={numberSnippet ? true : index === 2}
          snippetsCnt={numberSnippet ? 1 : preparingOfConversations.length}
          styleMessage={numberSnippet ? false : styleOfMessages}
          getNumberOfFocusedSnippet={showOnlyFocusedSnippet}
          oneOfTheMany={messages.length === 1}
          showSnippetsInStack={!notInStack}
          callBack={numberSnippet ? false : clearMessages}
          is_mobile={is_mobile}
          show_borderless_chat={showAppBorderlessChat}
          show_badge={showBadge}
        />
      )
    })

    return snippets
  }, [show_borderless_chat, unread, snippet, notInStack, is_mobile, conversations, updateTransitionSnippet])

  const makeDismissButtons = useMemo(() => {
    const buttonsStyleProps = {}

    if (is_mobile) {
      buttonsStyleProps.opacity = 1

      return (
        <div
          className={`${CSSPREF}-mnh-snippet-wrapper-dismiss-wrapper-mobile`}
          onClick={clearMessages}
        >
          <div className={`${CSSPREF}-mnh-snippet-wrapper-dismiss-wrapper-mobile-right-cross`} />
          <div className={`${CSSPREF}-mnh-snippet-wrapper-dismiss-wrapper-mobile-left-cross`} />
        </div>
      )
    }

    return (
      <div className={`${CSSPREF}-mnh-snippet-wrapper-dismiss-wrapper`}>
        <div
          className={`${CSSPREF}-mnh-snippet-wrapper-view-more`}
          onClick={handleViewMoreOnClick}
          style={buttonsStyleProps}
        >
          View More
        </div>
        <div
          className={`${CSSPREF}-mnh-snippet-wrapper-dismiss`}
          onClick={clearMessages}
          style={buttonsStyleProps}
        >
          Clear
        </div>
      </div>
    )
  }, [is_mobile])

  const handleOnClickChangeNotInStack = useCallback(() => {
    if (notInStack) {
      setNotInStack(false)
    } else {
      setNotInStack(true)
    }
  }, [notInStack])

  const makeCollapseButton = useMemo(() => {
    if (is_mobile && preparingOfConversations.length > 1) {
      return (
        <div
          className={!notInStack ?
            `${CSSPREF}-mnh-snippet-wrapper-collapse-button` :
            `${CSSPREF}-mnh-snippet-wrapper-collapse-button ${CSSPREF}-mnh-snippet-wrapper-collapse-button-close`}
          onClick={!notInStack ? null : handleOnClickChangeNotInStack}
        >
          <svg
            className={`${CSSPREF}-mnh-snippet-wrapper-collapse-button-svg`}
            x="0px"
            y="0px"
            width="20px"
            height="20px"
            viewBox="0 0 284.929 284.929"
          >
            <g>
              <path
                d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,
                195.285 C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,
                4.093,2.854,6.567,2.854 c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,
                4.093,2.848,6.563,2.848 c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,
                2.847-6.566 C284.929,199.378,283.984,197.188,282.082,195.285z"
              />
            </g>
          </svg>
          <span className={`${CSSPREF}-mnh-snippet-wrapper-collapse-button-text`}>Show less</span>
        </div>
      )
    }

    return null
  }, [is_mobile, notInStack, conversations])

  const fieldForClickSnippets = useMemo(() => {
    if (!notInStack && is_mobile && conversations.length > 1) {
      return (
        <div className={`${CSSPREF}-mnh-snippet-wrapper-on-click`} onClick={handleOnClickSnippets} />
      )
    }

    return null
  }, [notInStack, is_mobile, conversations])

  const snippetStyle = useCallback(() => {
    if (is_mobile && preparingOfConversations.length >= 1 && !snippet) {
      return `${CSSPREF}-mnh-snippet-wrapper ${CSSPREF}-mnh-snippet-wrapper--max-width`
    }

    return `${CSSPREF}-mnh-snippet-wrapper`
  }, [is_mobile, snippet, conversations])

  const setProps = useMemo(() => {
    let defaultPosition = messenger_position

    if (messenger_position === 'left') {
      defaultPosition = 'left'
    }

    return {
      className: snippetStyle(),
      style: {
        bottom: is_mobile ? '0px' : `${+messenger_padding_vertical + 60}px`,
        right: is_mobile ?
          '0px' :
          defaultPosition !== 'left' && `${messenger_padding_horizontal}px`,
        left: defaultPosition === 'left' && `${messenger_padding_horizontal}px`,
      },
    }
  }, [messenger_position, is_mobile])

  const showDismissButton = useMemo(() => {
    if ((preparingOfConversations.length > 1 && snippet === false) && !!unread && !show_borderless_chat) {
      return makeDismissButtons
    }

    return null
  }, [snippet, unread, show_borderless_chat, conversations])

  useEffect(() => {
    updateTransitions()
  }, [notInStack])

  return useMemo(() => {
    if (!showBadge && !show_borderless_chat && conversations.length !== 0) {
      return (
        <div
          {...setProps}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {makeCollapseButton}
          {fieldForClickSnippets}
          {showDismissButton}
          {makeSnippets}
        </div>
      )
    }
    return null
  }, [showBadge, show_borderless_chat, notInStack, conversations, snippet, is_mobile])
}
