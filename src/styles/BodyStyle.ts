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

    @keyframes glow-cyan {
  0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.2); }
}

@keyframes glow-green {
  0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.border-neon-cyan {
  border-color: #00ffff;
}

.border-neon-green {
  border-color: #00ff00;
}

.text-neon-cyan {
  color: #00ffff;
}

.text-neon-green {
  color: #00ff00;
}

.shadow-glow {
  animation: glow-cyan 2s infinite;
}

.shadow-glow-cyan {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.shadow-glow-green {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

`;

export default BodyContainer;