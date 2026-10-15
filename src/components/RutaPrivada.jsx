import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AvisoPrivado from './AvisoPrivado';

const RutaPrivada = ({ children, icono, titulo, texto }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <AvisoPrivado icono={icono} titulo={titulo} texto={texto} />;
  }

  return children;
};

export default RutaPrivada;