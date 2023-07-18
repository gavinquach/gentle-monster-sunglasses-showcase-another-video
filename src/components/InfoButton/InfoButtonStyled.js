import styled from "styled-components";

export const InfoButtonStyled = styled.div`
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6.5rem;
    height: 5rem;
    border-radius: 25%;
    color: black;
    text-decoration: none;
    font-family: 'Arial', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: #f8f8f888;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease-in-out;
    z-index: 1;

    /* center element inside */
    display: flex;
    justify-content: center;
    align-items: center;

    /* add small animation */
    &:hover {
        transform: translate(-50%, -50%) scale(1.1);
    }
    &:active {
        transform: translate(-50%, -50%) scale(0.9);
    }
`;
