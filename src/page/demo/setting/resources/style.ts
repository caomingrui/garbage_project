import styled from "styled-components";

export const LayoutStyle = styled.div`
  width: 100%;
`

// 生产厂家
export const ManufacturerStyle = styled.div`
    width: 80%;   
    display: flex;
    justify-content: space-between;
    
    &>div {
        width: 45%;
        
        .inputView {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
`;

export const ModalsContext = styled.div`
      width: 100%;
      display: flex;
      justify-content: space-between;
          
          &>div {
            flex: 1;
          }
          
          &>div:last-child {
              min-height: 200px;
              max-height: 300px;
              overflow-y: scroll;
              
              >p {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  border-bottom: 1px solid #cccccc;
              }
          }
`

export const DetailsSetup = styled.div`
     width: 100%;
     display: flex;
     justify-content: space-between;
     
     &>div {
        width: 30%;   
     }
     
     &>form {
        width: 70%;
     }
`;