import { createSelector } from 'reselect'
import { makeSnippetMessage } from 'libs/utils'

export const conversations = state => state.conversations.list

export const hiddenConversation = state => state.hiddenConversations.hidden

export const snippetsConversationsSelector = createSelector(
  conversations,
  hiddenConversation,
  (conversationsList, hideList) => {
    const messages = []

    Object.keys(conversationsList).forEach((id) => {
      if (hideList.indexOf(id) < 0
        && conversationsList[id].conversation_message
        && conversationsList[id].conversation_message.delivery_option !== 'badge'
      ) {
        if (!conversationsList[id].read && conversationsList[id].conversation_parts.length) {
          const message = conversationsList[id].conversation_parts[conversationsList[id].conversation_parts.length - 1]
          if (!message.snippet) {
            message.snippet = makeSnippetMessage(message)
          }

          messages.push(message)
        } else if (!conversationsList[id].read && !conversationsList[id].conversation_parts.length) {
          if (!conversationsList[id].conversation_message.snippet) {
            conversationsList[id]
              .conversation_message
              .snippet = makeSnippetMessage(conversationsList[id].conversation_message)
          }

          messages.push(conversationsList[id].conversation_message)
        }
      }
    })

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

    return messages
  }
)
