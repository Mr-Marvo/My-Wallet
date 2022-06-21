import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import copy from '../assets/copy.png';
import './Dashboard.css';
import { ethers } from 'ethers';

function Dashboard() {

    const [walletAdrres, setWalletAdrres] = useState(null);
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState('ETH');
    const [error, setError] = useState(null);

    //get wallet address
    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                accountChangedHandler(result[0]);
            });
    });

    const accountChangedHandler = (address) => {
        setWalletAdrres(address);
        getBalance(address.toString());
    }

    //get wallet balance
    const getBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(balance => {
                setBalance(ethers.utils.formatEther(balance).slice(0, 6));
            });
    }

    window.ethereum.on('accountsChanged', accountChangedHandler);

    //reload when chain changed
    window.ethereum.on('chainChanged', function () {
        window.location.reload();
    });

    //address hide
    let first;
    let last;
    if (walletAdrres !== null) {
        first = walletAdrres.slice(0, 5);
        last = walletAdrres.slice(-4);
    }

    //copy to clipboard
    const copyHandler = () => {
        navigator.clipboard.writeText(walletAdrres);
        alert('Copied!');
    }

    //change network to eth mainnet
    const changeToEthMainNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(1).toString(16)}` }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${Number(4).toString(16)}`,
                                chainName: "Ethereum Testnet Rinkeby",
                                nativeCurrency: {
                                    name: "Rinkeby Ether",
                                    symbol: "RIN",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "https://rinkeby.infura.io/v3/69302fe6fb334a56a954d24e39a4ae81",
                                    "wss://rinkeby.infura.io/ws/v3/69302fe6fb334a56a954d24e39a4ae81"
                                ],
                                blockExplorerUrls: ["https://rinkeby.etherscan.io"]
                            },
                        ],
                    });
                } catch (addError) {
                    setError(addError.message);
                }
            }

            setError(switchError.message)
        }
    }

    //change network to eth testnet (rinkeby)
    const changeToEthTestNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(4).toString(16)}` }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${Number(1).toString(16)}`,
                                chainName: 'Ethereum Mainnet',
                                nativeCurrency: {
                                    name: "Ether",
                                    symbol: "ETH",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
                                    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
                                    "https://api.mycryptoapi.com/eth",
                                    "https://cloudflare-eth.com"
                                ],
                                blockExplorerUrls: ["https://etherscan.io"]
                            },
                        ],
                    });
                } catch (addError) {
                    setError(addError.message);
                }
            }

            setError(switchError.message)
        }
    }

    return (
        <div className="page-container">
            <header className="container">
                <img src={logo} className="logo" alt="logo" />
                <h1>
                    My Wallet
                </h1>
                <div className='address-container'>
                    <p>{first}...{last}</p> &nbsp;&nbsp;
                    <img src={copy} className="copy" alt="logo" onClick={copyHandler} />
                </div>

                <div className='balance-container'>
                    <p>Balance</p>
                    <h2>{balance} {network}</h2>
                </div>

                <h2 className='switch-title'>Switch Network</h2>

                <div className='natwork-switcher'>
                    <button className='btn-network' onClick={changeToEthMainNet}>Ethereum</button>
                    &nbsp; &nbsp; &nbsp;
                    <button className='btn-network' onClick={changeToEthTestNet}>Rinkeby</button>
                </div>

                <div>
                    <small>{error}</small>
                </div>
            </header>
        </div>
    );
}

export default Dashboard;