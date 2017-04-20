import styled from 'styled-components';

const View = styled.div`
  align-items: stretch;
  border: none;
  box-sizing: border-box;
  display: flex;
  flex-basis: auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: relative;
  // fix flexbox bugs
  min-height: 0;
  min-width: 0;
`;

View.displayName = 'View';

export default View;
