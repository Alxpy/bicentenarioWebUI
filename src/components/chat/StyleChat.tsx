import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Colores base
export const neonCyan = '#00ffff';
export const neonGreen = '#00ff00';
export const black = '#000';
export const darkBg = '#001111';

// Animaciones
export const glowCyan = keyframes`
  0% { box-shadow: 0 0 5px ${neonCyan}33; }
  50% { box-shadow: 0 0 20px ${neonCyan}66; }
  100% { box-shadow: 0 0 5px ${neonCyan}33; }
`;

export const glowGreen = keyframes`
  0% { box-shadow: 0 0 5px ${neonGreen}33; }
  50% { box-shadow: 0 0 20px ${neonGreen}66; }
  100% { box-shadow: 0 0 5px ${neonGreen}33; }
`;

// Estilos globales
export const GlobalStyles = createGlobalStyle`
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

// Componentes estilizados
export const CyberButton = styled.button`
  background: ${black};
  border: 2px solid ${neonCyan};
  color: ${neonCyan};
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  &:hover {
    background: ${neonCyan}1a;
    box-shadow: 0 0 15px ${neonCyan}4d;
  }
`;

export const CyberCard = styled.div<{ expanded: boolean }>`
  background: radial-gradient(circle at center, ${darkBg}, ${black});
  border: 2px solid ${neonCyan};
  animation: ${glowCyan} 2s infinite;
  width: ${({ expanded }) => (expanded ? '400px' : '350px')};
  height: ${({ expanded }) => (expanded ? '600px' : '500px')};
`;

export const CyberInput = styled.input`
  background: ${black};
  border: 2px solid ${neonCyan};
  color: ${neonCyan};
  font-family: 'Courier New', monospace;
  &::placeholder {
    color: ${neonCyan}80;
  }
  &:focus {
    box-shadow: 0 0 10px ${neonCyan}33;
  }
`;

export const MessageBubble = styled.div<{ role: 'user' | 'assistant' }>`
  border: 1px solid ${({ role }) => (role === 'user' ? neonCyan : neonGreen)};
  color: ${({ role }) => (role === 'user' ? neonCyan : neonGreen)};
  background: ${({ role }) => 
    role === 'user' ? `${neonCyan}1a` : `${neonGreen}1a`};
  text-shadow: 0 0 8px ${({ role }) => 
    role === 'user' ? `${neonCyan}80` : `${neonGreen}80`};
  box-shadow: ${({ role }) => 
    role === 'user' ? `0 0 15px ${neonCyan}4d` : `0 0 15px ${neonGreen}4d`};
`;

export const StatusIndicator = styled.div<{ loading: boolean }>`
  color: ${({ loading }) => (loading ? neonGreen : neonCyan)};
  &::before {
    content: '${({ loading }) => 
      loading ? '[STATUS: PROCESSING...]' : '[STATUS: ONLINE]'}';
  }
`;