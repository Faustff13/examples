import styled from "styled-components";
import React from "react";

export const Field = styled.div`
  display: block;
  background-color: rgba(192, 192, 192, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
`

export const Modal = styled.div`
  display: block;
  min-width: 200px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(192,192,192, .5)
  padding: 20px;
  width: 500px;
  height: 300px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
`

export const Content = styled.div`
  position: relative;
  top: 50%;
  text-align: center;
`

export const CloseButton = styled.div`
  display: block;
  border: 1px solid #78e28a;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: relative;
  float: right;
  top: 10px;
  left: -10px;
  font-size: 30px;
  text-align: center;
  color: #78e28a;
  
  &:hover {
    background-color: #78e28a;
    color: white;
  }
`

export const Cross = styled.div`
  position: absolute;
  top: -4px;
  left: 7px;
`

export const Background = styled.div`
  width: 100%;
  height: 100%;
`

export const Header = styled.div`
  height: 50px;
  border-top-left-radius: 5px; 
  border-top-right-radius: 5px; 
    background-color: #96a4e6;
  border-bottom: 1px solid #96a4e6;
`
