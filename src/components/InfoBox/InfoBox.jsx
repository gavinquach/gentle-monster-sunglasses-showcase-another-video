import {
    InfoBoxContainerStyled,
    InfoBoxHeaderStyled,
    InfoBoxParagraphStyled,
} from "./InfoBoxStyled";

export const InfoBox = () => {
    return (
        <InfoBoxContainerStyled id="infoBox">
            <InfoBoxHeaderStyled id="infoBoxName" />
            <InfoBoxParagraphStyled id="paragraph" />
        </InfoBoxContainerStyled>
    );
};
