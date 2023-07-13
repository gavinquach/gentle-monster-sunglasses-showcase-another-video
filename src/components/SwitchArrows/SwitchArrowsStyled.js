import styled from "styled-components";

const ArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  z-index: 1;
`;

export const ArrowIcon = styled.div`
  width: 5vw;
  height: 10vh;
  font-size: 3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  color: #f8f8f8;
  background: ${({ direction }) =>
    direction === "left"
      ? `linear-gradient(
    -90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 100%
  )`
      : `linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 100%
  )`};
`;

export const LeftArrow = styled(ArrowWrapper)`
  left: 1rem;
`;

export const RightArrow = styled(ArrowWrapper)`
  right: 1rem;
`;
