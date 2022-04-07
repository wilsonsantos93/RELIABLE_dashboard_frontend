import React from 'react';
import './styles/Index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import {createRoot} from "react-dom/client";


const container = document.getElementById('root');

if (container !== null) {

    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>,
    )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
