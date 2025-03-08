import { Route, Routes} from 'react-router-dom';
import React from 'react';

interface Props{
    children: JSX.Element[] | JSX.Element	
}

const RoutesNotFound = ({children}:Props) => {
  return (
    <Routes>
      {children}
        <Route path="*" element={<h1>404 Not Found</h1>}/>
    </Routes>
  )
}

export default RoutesNotFound;
