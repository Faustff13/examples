/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, {useCallback, useEffect, useMemo} from 'react';
import { useInjectSaga } from "../../utils/injectSaga";
import { useDispatch, useSelector } from "react-redux";
import saga from './saga';
import { dataLoading, changePriority } from "./actions";
import { Container, Error, Fields, Header, Table } from "./styledHomePage";
import { Spinner } from '../../components/loadingSpinner/spinner'
import BlockContent from '../../components/BlockContent/blockContent'
import Card from '../../components/Card/card'

const key = 'homePage'

export default function HomePage() {
  useInjectSaga({key, saga})

  const loading = useSelector((state) => state.app.loading)
  const error = useSelector((state) => state.app.error)
  const list = useSelector((state) => state.app.list)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(dataLoading())
  }, [])

  const changesPriority = useCallback((index, itemIndex, moving) => {
    dispatch(changePriority(index, itemIndex, moving))
  }, [list, dispatch])

  const showData = useMemo(() => {
    if (list.length > 0 && !error && !loading) {
      const sortList = []

      list.forEach((value, index) => {
        sortList.push(
          <Card
            changesPriority={changesPriority}
            index={index}
            key={value.id}
            id={value.id}
            task_name={value.task_name}
            create={value.create}
            manager={value.manager}
            priority={value.priority}
           />
         )
      })
    return sortList
    }
  }, [error, list, loading, dispatch])

  return (
    <Container>
      <Table>
        <Header>
          <Fields>id</Fields>
          <Fields>task name</Fields>
          <Fields>create</Fields>
          <Fields>manager</Fields>
          <Fields>priority</Fields>
        </Header>
        <BlockContent>
          { showData }
          { loading ? <Spinner /> : null }
          { error ? <Error>{error}</Error> : null }
        </BlockContent>
      </Table>
    </Container>
  );
}
