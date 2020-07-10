import ls from 'local-storage'

export function setToLocalStorage(conversations) {
    const hideConversations = []
    let hidden = []
    console.log(conversations)
    for (let i = 0; i < conversations.length; ++i) {
        hideConversations.push(conversations[i].conversation_id)
    }
    if (ls.get('hiddenConversations')) {
        hidden = ls.get('hiddenConversations')
    }

    const hiddenConversations = Array.from(new Set(hideConversations.concat(hidden)))

    ls.set('hiddenConversations', hiddenConversations)

    return hideConversations
}

export function addLocalStorage() {
    let hidden = []

    if (ls.get('hiddenConversations')) {
        hidden = ls.get('hiddenConversations')

        return hidden
    } return hidden
}