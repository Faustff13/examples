import React, {useCallback, useEffect, useRef} from 'react'
import { Content, ContentField } from "./styledCard";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { modals, changeHeightList } from "../../containers/HomePage/actions";
import { ItemTypes } from "../../utils/itemTypes";

export default function (props) {
  const { id, task_name, create, manager, priority, index, changesPriority } = props
  const ref = useRef(null)
  const modal = useSelector((state) => state.app.modals)

  const dispatch = useDispatch()

  useEffect(() => {
      if (index === 14 && ref.current) {
        dispatch(changeHeightList(ref.current.getBoundingClientRect().top))
      }
  }, [])

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      let moving = false

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      if (index > item.index) {
        moving = true
      }

      changesPriority(index, item.index, moving)

      item.index = index
    },
  })

  const opacity = isDragging ? 0 : 1

  const openModal = useCallback((event) => {
    event.preventDefault()
    dispatch(modals(true))
  }, [modal, dispatch])

  drag(drop(ref))

  const date = useCallback(() => {
    const date = new Date(create)
    return date.toLocaleString('ru')
  }, [create])

  return (
    <Content ref={ref} onDoubleClick={openModal} style={{ opacity }} >
      <ContentField>{id}</ContentField>
      <ContentField>{task_name}</ContentField>
      <ContentField>{date()}</ContentField>
      <ContentField>{manager}</ContentField>
      <ContentField>{priority}</ContentField>
    </Content>
  )
}
