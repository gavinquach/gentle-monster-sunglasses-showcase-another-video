import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { StrictMode } from 'react';
import { Loader } from '@react-three/drei';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <StrictMode>
        <App />
        <Loader />
    </StrictMode>
);
