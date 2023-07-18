import styled from "styled-components";

export const InfoBoxContainerStyled = styled.div`
    display: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-18%, -50%);
    width: 25%;
    height: auto;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(0.5rem);
    border-radius: 1rem;
    padding: 1rem;
    font-family: 'Arial', sans-serif;
    user-select: none;
    pointer-events: none;
    z-index: 1;
`;

export const InfoBoxHeaderStyled = styled.div`
    font-size: 2rem;
    margin-bottom: 3rem;
    color: #ffffff;
`;

export const InfoBoxParagraphStyled = styled.p`
    font-size: 1.5rem;
    color: #ffffff;
`;