import logo from '../assets/logo.png';
import './Home.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate()
    const [isConnect, setIsConnect] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [walletAdrres, setWalletAdrres] = useState(null);
    const [btnText, setBtnText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
        if (isConnect) {
            navigate(`/dashboard`);
        } else {
            if (window.ethereum) {
                window.ethereum.request({ method: 'eth_requestAccounts' })
                    .then(result => {
                        setIsConnect(true);
                        setWalletAdrres(result[0]);
                        setBtnText('GoTo My Wallet');
                    })
                    .catch(err => {
                        setErrorMessage(err);
                    });
            } else {
                setErrorMessage('Install MetaMask!');
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>
                    My Wallet
                </h1>
                <button onClick={connectWalletHandler} className='btn-connect'>
                    {btnText}
                </button>
                <br />
                <small className='warningText'>{errorMessage}</small>
                <small className='walletAddress'>{walletAdrres}</small>
            </header>
        </div>
    );
}

export default Home;
