import React from 'react'
import { BlockContent } from "./styledBlockContent";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSelector } from "react-redux";

export default function (props) {
  const height = useSelector((state) => state.app.height)

  return (
    <DndProvider backend={HTML5Backend}>
      <BlockContent style={{height: `${height}px`}}>
        { props.children }
      </BlockContent>
    </DndProvider>
  )
}
