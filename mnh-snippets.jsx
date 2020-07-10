'use strict'

/* global CSSPREF */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ls from 'local-storage'
import Snippet from 'containers/mnh-snippet'
import { openModal } from 'actions/modals'
import { makeSnippetMessage } from 'libs/utils'
import { showAppBadge, showConversations } from 'actions/app'
import { sendGAEvent } from '../../google-analytics'

import './styles'


class SnippetsList extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    conversations: PropTypes.object.isRequired,
    messenger_padding_horizontal: PropTypes.any.isRequired,
    messenger_padding_vertical: PropTypes.any.isRequired,
    messenger_position: PropTypes.string.isRequired,
    is_mobile: PropTypes.bool.isRequired,
    show_launcher: PropTypes.bool.isRequired,
    modals: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.conversations = []
  }

  state = {
    notInStack: false,
    openModal: true,
    cntSnippets: 0,
    idSnippet: false,
  }

  componentDidMount() {
    this.updateTransitions()
  }

  componentDidUpdate() {
    this.updateTransitions()
  }

  clearMessages = () => {
    sendGAEvent('Click', 'Cleared all')
    this.setState({
      idSnippet: false,
      cntSnippets: 0,
    }, this.hideSnippets)
  }

  handleMouseEnter = () => {
    if (!this.props.is_mobile) {
      this.setState({
        notInStack: true,
      })
    }
  }

  handleMouseLeave = () => {
    if (!this.props.is_mobile) {
      this.setState({
        notInStack: false,
      })
    }
  }

  handleOnClickSnippets = (e) => {
    e.stopPropagation()

    if (this.props.is_mobile) {
      this.setState({
        notInStack: true,
      })
    }
  }

  hideSnippets = () => {
    const conversations = []
    let hidden = []
    for (let i = 0; i < this.conversations.length; ++i) {
      conversations.push(this.conversations[i].conversation_id)
    }
    if (ls.get('hiddenConversations')) {
      hidden = ls.get('hiddenConversations')
    }
    const hiddenConversations = conversations.concat(hidden)
    ls.set('hiddenConversations', hiddenConversations)
  }

  openConversationsList = () => {
    sendGAEvent('Click', 'Viewed more')

    this.props.dispatch(showAppBadge())
    this.props.dispatch(showConversations())
  }

  preparingOfConversations = () => {
    const { conversations } = this.props
    const messages = []
    const { idSnippet } = this.state

    let hidden = []
    if (ls.get('hiddenConversations')) {
      hidden = ls.get('hiddenConversations')
    }

    if (idSnippet && conversations[idSnippet] && conversations[idSnippet].conversation_parts.length) {
      const messageRead = conversations[idSnippet]
        .conversation_parts[conversations[idSnippet].conversation_parts.length - 1]
      if (!messageRead.snippet) {
        messageRead.snippet = makeSnippetMessage(messageRead)
      } else if (conversations[idSnippet] && !conversations[idSnippet].conversation_parts.length) {
        if (!conversations[idSnippet].conversation_message.snippet) {
          conversations[idSnippet]
            .conversation_message
            .snippet = makeSnippetMessage(conversations[idSnippet].conversation_message)
        }

        messages.push(conversations[idSnippet].conversation_message)
      }

      messages.push(messageRead)
    } else {
      Object.keys(conversations).forEach((id) => {
        // we don't need to cnt `badge` messages as snippet
        if (hidden.indexOf(id) < 0
          && conversations[id].conversation_message
          && conversations[id].conversation_message.delivery_option !== 'badge'
        ) {
          if (!conversations[id].read && conversations[id].conversation_parts.length) {
            const message = conversations[id].conversation_parts[conversations[id].conversation_parts.length - 1]
            if (!message.snippet) {
              message.snippet = makeSnippetMessage(message)
            }

            messages.push(message)
          } else if (!conversations[id].read && !conversations[id].conversation_parts.length) {
            if (!conversations[id].conversation_message.snippet) {
              conversations[id]
                .conversation_message
                .snippet = makeSnippetMessage(conversations[id].conversation_message)
            }

            messages.push(conversations[id].conversation_message)
          }
        }
      })
    }

    messages.sort((a, b) => {
      const createDateA = a.created_at
      const dateA = new Date(createDateA)
      const createDateB = b.created_at
      const dateB = new Date(createDateB)
      if (new Date(dateA.getTime()) > new Date(dateB.getTime())) {
        return -1
      }
      return 0
    })

    this.conversations = messages

    return messages.slice(0, 3)
  }

  updateTransitions = () => {
    this.setState({
      cntSnippets: this.preparingOfConversations().length,
    })
  }

  makeSnippets = () => {
    const conversations = this.preparingOfConversations()
    const styleOfMessages = this.state.cntSnippets > 1 && !this.state.idSnippet
    const snippets = []
    const updateTransition = !!this.state.cntSnippets

    if (
      this.state.openModal &&
      conversations.length > 0 &&
      conversations[0].delivery_option === 'full' &&
      conversations[0].message_style === 2 &&
      this.props.modals.length === 0
    ) {
      this.props.dispatch(openModal({
        reply_disabled: this.props.conversations[conversations[0].conversation_id.reply_disabled],
        conversation_id: conversations[0].conversation_id,
        type: 'MESSAGE',
        replace: true,
        data: {
          message: conversations[0],
        },
      }))

      this.setState({
        openModal: false,
      })
    }

    conversations.forEach((value, index) => {
      snippets.push(
        <Snippet
          updateTransition={updateTransition}
          message={value}
          key={value.conversation_id}
          keyProp={index}
          isLastSnippet={this.state.idSnippet ? true : index === 2}
          snippetsCnt={this.state.idSnippet ? 1 : this.state.cntSnippets}
          styleMessage={styleOfMessages}
          getNumberOfFocusedSnippet={this.showOnlyFocusedSnippet}
          oneOfTheMany={conversations.length === 1}
          showSnippetsInStack={!this.state.notInStack}
          snippet={!!this.state.idSnippet}
        />
      )
    })
    return snippets
  }

  showOnlyFocusedSnippet = (idSnippet = false) => {
    this.setState({
      idSnippet,
      cntSnippets: 1,
    }, this.preparingOfConversations)
  }

  makeDismissButtons = () => {
    const buttonsStyleProps = {}

    if (this.props.is_mobile) {
      buttonsStyleProps.opacity = 1

      return (
        <div
          className={`${CSSPREF}-mnh-snippet-wrapper-dismiss-wrapper-mobile`}
          onClick={this.clearMessages}
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
          onClick={this.openConversationsList}
          style={buttonsStyleProps}
        >
          View More
        </div>
        <div
          className={`${CSSPREF}-mnh-snippet-wrapper-dismiss`}
          onClick={this.clearMessages}
          style={buttonsStyleProps}
        >
          Clear
        </div>
      </div>
    )
  }

  handleOnClickChangeNotInStack = () => {
    if (this.state.notInStack) {
      this.setState({
        notInStack: false,
      })
    } else {
      this.setState({
        notInStack: true,
      })
    }
  }

  makeCollapseButton = () => {
    if (this.props.is_mobile && this.state.cntSnippets > 1) {
      return (
        <div
          className={!this.state.notInStack ?
            `${CSSPREF}-mnh-snippet-wrapper-collapse-button` :
            `${CSSPREF}-mnh-snippet-wrapper-collapse-button ${CSSPREF}-mnh-snippet-wrapper-collapse-button-close`}
          onClick={!this.state.notInStack ? null : this.handleOnClickChangeNotInStack}
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
  }

  fieldForClickSnippets = () => {
    if (!this.state.notInStack && this.props.is_mobile && this.state.cntSnippets > 1) {
      return (
        <div className={`${CSSPREF}-mnh-snippet-wrapper-on-click`} onClick={this.handleOnClickSnippets} />
      )
    } return null
  }

  snippetStyle = () => {
    if (this.props.is_mobile && this.state.cntSnippets >= 1 && !this.state.idSnippet) {
      return `${CSSPREF}-mnh-snippet-wrapper ${CSSPREF}-mnh-snippet-wrapper--max-width`
    }
    return `${CSSPREF}-mnh-snippet-wrapper`
  }

  render() {
    let defaultPosition = this.props.messenger_position

    if (this.props.messenger_position === 'left') {
      defaultPosition = 'left'
    }

    const bottomPadding = this.props.show_launcher ? 60 : 0
    const props = {
      className: this.snippetStyle(),
      style: {
        bottom: this.props.is_mobile ? '0px' : `${this.props.messenger_padding_vertical + bottomPadding}px`,
        right: this.props.is_mobile ?
          '0px' :
          defaultPosition !== 'left' && `${this.props.messenger_padding_horizontal}px`,
        left: defaultPosition === 'left' && `${this.props.messenger_padding_horizontal}px`,
      },
    }

    const showDismissButton = this.state.cntSnippets > 1 && this.state.idSnippet === false

    return (
      <div
        {...props}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.makeCollapseButton()}
        {this.fieldForClickSnippets()}
        {showDismissButton && this.makeDismissButtons()}

        <div className={`${CSSPREF}-mnh-snippets-wrapper`}>
          {this.makeSnippets()}
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  return {
    is_mobile: state.app.is_mobile,
    conversations: state.conversations.list,
    messenger_padding_horizontal: state.config.messenger_padding_horizontal,
    messenger_padding_vertical: state.config.messenger_padding_vertical,
    messenger_position: state.config.messenger_position,
    modals: state.modals,
    show_launcher: state.props.show_launcher,
  }
})(SnippetsList)
