import styled from 'styled-components';
import colors from './colors';
import text_fonts from './text_fonts';

export const BodyContainer = styled.div`
    
    color: ${colors.crema};
    

    .text_title{
        font-family: ${text_fonts.title};
    }

    .text_general{
        font-family: ${text_fonts.general};
    }

    .text_special{
        font-family: ${text_fonts.special};
    }

`;

export default BodyContainer;