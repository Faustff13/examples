import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: row;
   justify-content: space-around;
  &:nth-child(even) {
    background-color: #e8e8e8;
  }
`

export const ContentField = styled.div`
  display: block;
  min-width: 20%;
  max-width: 100%;
  text-align: center;
  padding: 10px;
`
