import styled from "styled-components";

export const InfoButtonStyled = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    color: black;
    text-decoration: none;
    font-family: 'Arial', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    /* white to gray gradient for background color from top to bottom */
    background: linear-gradient(180deg, #f0f0f0, #d4d4d4);
    box-shadow: 0 0.5rem 1ch rgba(0, 0, 0, 0.7);
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease-in-out;
    z-index: 2;

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

    @media (max-width: 768px) {
        width: 3rem;
        height: 3rem;
        font-size: 1rem;
    }
`;
