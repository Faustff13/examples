import styled from "styled-components";

export const Container = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 12px solid #3498db;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  margin: auto;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`
