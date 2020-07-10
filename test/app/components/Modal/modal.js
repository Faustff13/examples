import React, { useCallback } from 'react'
import { Field, Content, CloseButton, Modal, Cross, Background, Header } from "./styledModal";
import { useDispatch } from "react-redux";
import { modals } from '../../containers/HomePage/actions'

export default function () {
  const dispatch = useDispatch()

  const closeModal = useCallback(() => {
    dispatch(modals(false))
  }, [dispatch])

  return (
    <Field>
      <Background onClick={closeModal} />
      <Modal>
        <Header>
          <CloseButton onClick={closeModal}>
            <Cross>x</Cross>
          </CloseButton>
        </Header>
        <Content>
          Example
        </Content>
       </Modal>
    </Field>
  )
}
