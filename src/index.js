import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { initContracts, initConnected } from './utils/init';

if (
    typeof window.ethereum !== 'undefined' &&
    window.ethereum.selectedAddress &&
    window.ethereum.isConnected()
) {
    initContracts()
        .then(() => {
            ReactDOM.render(
                <App />,
                document.querySelector('#root')
            )
        })
        .catch(console.error);
} else if (typeof window.ethereum === 'undefined') {
    ReactDOM.render(
        <App />,
        document.querySelector('#root')
    )
} else {
    initConnected()
        .then(() => {
            ReactDOM.render(
                <App />,
                document.querySelector('#root')
            )
        });
}

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );