export function setHiddenConversations() {
    const localStorage = addLocalStorage()

    return {
        type: 'GET_HIDDEN_CONVERSATIONS',
        localStorage,
    }
}

export function addHiddenConversations(hiddenConversation) {
    const hideConversations = setToLocalStorage(hiddenConversation)
    return {
        type: 'SET_HIDDEN_CONVERSATIONS',
        hideConversations,
    }
}