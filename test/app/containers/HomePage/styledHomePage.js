import styled from "styled-components";

export const Container = styled.div`
  display: block;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 100px;
`

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  border: 1px solid #e8e8e8;
  max-width: 900px;
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid #e8e8e8;
    justify-content: space-around;
`

export const Error = styled.div`
  display: block;
  margin: auto;
`

export const Fields = styled.div`
  display: block;
  min-width: 20%;
  max-width: 100%;
  text-align: center;
  padding: 10px;
`
