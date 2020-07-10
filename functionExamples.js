///////////////////////////////////////////////////////////////////////

_renderReact() {
    if (this.reactDOM) {
        return
    }

    const { conversations, config, user } = this.store.getState()

    if (user.role === 'user_role' && !config.messenger_enabled_for_users) {
        return
    }

    if ((user.role === 'visitor_role' || user.role === 'lead_role') && !config.messenger_enabled_for_visitors) {
        return
    }

    const len = conversations.ordered.length

    if (len > 1) {
        this.store.dispatch(showConversations())
    } else if (len === 1) {
        this.store.dispatch(showConversation(
            conversations.list[conversations.ordered[0]].id
        ))
    } else {
        this.store.dispatch(showNewConversation())
        this.store.dispatch(scrollToStart(true))
    }

    this.reactDOM = document.createElement('div')
    document.body.appendChild(this.reactDOM)
    window.REDUX_STORE = this.store

    // if (!config.messenger_enabled_for_url) return

    const { pathname, search } = window.location
    const urls = config.messenger_enabled_for_url
    const location = (pathname + search).toLowerCase()
    let showWidget = false

    function checkSwitch(index, values) {
        switch (index) {
            case 'equals': {
                if (values.toLowerCase() === location && values !== '') {
                    showWidget = true
                }
                break
            }
            case 'not_equal': {
                if (values.toLowerCase() !== location && values !== '') {
                    showWidget = true
                }
                break
            }
            case 'contains': {
                if (location.includes(values.toLowerCase()) && values !== '') {
                    showWidget = true
                }
                break
            }
            case 'not_contain': {
                if (!location.includes(values.toLowerCase()) && values !== '') {
                    showWidget = true
                }
                break
            }
            case 'starts_with': {
                if (location.startsWith(values.toLowerCase()) && values !== '') {
                    showWidget = true
                }
                break
            }
            case 'ends_with': {
                if (location.endsWith(values.toLowerCase()) && values !== '') {
                    showWidget = true
                }
                break
            }
            default: showWidget = false
        }
    }

    map(urls, (values, index) => {
        if (typeof values === 'string') {
            checkSwitch(index, values)
        } else if (typeof values === 'object') {
            map(values, (url) => {
                checkSwitch(index, url)
            })
        }
    })

    showWidget = true // todo: remove after backend implementation
    if (!showWidget) return


    // GOOGLE ANALYTICS =========================

    ReactGA.initialize('//////////', {
        debug: false,
        titleCase: false,
        gaOptions: {
            name: '///////',
        },
    })
    ReactGA.ga('create', '///////////')

    // ==========================================

    if (NODE_ENV !== 'production') {
        const { AppContainer } = require('react-hot-loader')
        ReactDOM.render(<AppContainer><MNHApp /></AppContainer>, this.reactDOM)

        if (typeof module !== 'undefined' && module.hot) {
            module.hot.accept('./containers/mnh-app', () => {
                const NewMNHApp = require('containers/mnh-app').default
                ReactDOM.render(<AppContainer><NewMNHApp /></AppContainer>, this.reactDOM)
            })
        }

        return
    }

    if (NODE_ENV === 'production') {
        ReactDOM.render(<MNHApp />, this.reactDOM)
    }
}

/////////////////////////////////////////////

handleSubmitFile(file) {
    const file_type = getFileType(file)

    if (!file_type) {
        if (this.props.audio_enabled) {
            playOnError()
        }

        // fixme: this setTimeOut is here to make the sound work
        /* eslint-disable-next-line */
        setTimeout(() => alert('Not acceptable file type ' + file.type), 100)

        return
    }

    if (file_type === UPLOAD_TYPE_IMAGE) {
        convertToBase64(file, (binary) => {
            this.props.dispatch(
                uploadFile(this.conversationId, file, file_type, binary)
            )
        })
    } else {
        this.props.dispatch(
            uploadFile(this.conversationId, file, file_type)
        )
    }

    this.openConversation()

    // this setInterval save file-list about reload files
    const setIntervalId = setInterval(() => {
        const fileList = file
        if (this.props.showBadge === false) clearInterval(setIntervalId)
        const uploads = Object.keys(this.props.uploadFiles)
        if (uploads.length !== 0) {
            map(this.props.uploadFiles, (value, index) => {
                if (this.props.uploadFiles[index].status === 'reload') {
                    this.props.dispatch(
                        removeUpload(this.props.uploadFiles[index].upload_id)
                    )
                    this.props.dispatch(
                        uploadFile(this.conversationId, fileList, file_type)
                    )
                }
            })
        } else clearInterval(setIntervalId)
    }, 1000)
}

