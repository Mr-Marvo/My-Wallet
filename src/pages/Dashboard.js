import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import copy from '../assets/copy.png';
import './Dashboard.css';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputDecimal } from '../assets/components/InputDecimal';
import Web3 from 'web3';

function Dashboard() {

    const [walletAdrres, setWalletAdrres] = useState(null);
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [amount, setAmount] = useState("");
    const [reciever, setReciever] = useState("");
    const [txHash, setTxHash] = useState(null);
    const [isHashAvailable, setHashAvailability] = useState(false);

    //Toast configs
    const copyied = (content) => toast.success(content, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    });

    const toastError = () => toast.error(error, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const toastSuccess = () => toast.info(success, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

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
        copyied('Address Copied!');
    }

    //change network to eth mainnet
    const changeToEthMainNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(1).toString(16)}` }],
            });
            setNetwork('ETH');
            setSuccess('Network Changed to Ethereum MainNet');
            toastSuccess();
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
                    toastError();
                }
            }

            setError(switchError.message);
            toastError();
        }
    }

    //change network to eth testnet (rinkeby)
    const changeToEthTestNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(4).toString(16)}` }],
            });
            setNetwork('ETH');
            setSuccess('Network Changed to Ethereum Testnet');
            toastSuccess();
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
                    toastError();
                }
            }

            setError(switchError.message);
            toastError();
        }
    }

    //change network to BSC MaiNet
    const changeToBSCMainNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(56).toString(16)}` }],
            });
            setNetwork('BNB');
            setSuccess('Network Changed to Binance Smart Chain');
            toastSuccess();
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${Number(56).toString(16)}`,
                                chainName: 'Binance Smart Chain Mainnet',
                                nativeCurrency: {
                                    name: "Binance Chain Native Token",
                                    symbol: "BNB",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "https://bsc-dataseed1.binance.org",
                                    "https://bsc-dataseed2.binance.org",
                                    "https://bsc-dataseed3.binance.org",
                                    "https://bsc-dataseed4.binance.org",
                                    "https://bsc-dataseed1.defibit.io",
                                    "https://bsc-dataseed2.defibit.io",
                                    "https://bsc-dataseed3.defibit.io",
                                    "https://bsc-dataseed4.defibit.io",
                                    "https://bsc-dataseed1.ninicoin.io",
                                    "https://bsc-dataseed2.ninicoin.io",
                                    "https://bsc-dataseed3.ninicoin.io",
                                    "https://bsc-dataseed4.ninicoin.io",
                                    "wss://bsc-ws-node.nariox.org"
                                ],
                                blockExplorerUrls: ["https://bscscan.com"]
                            },
                        ],
                    });
                } catch (addError) {
                    setError(addError.message);
                    toastError();
                }
            }

            setError(switchError.message);
            toastError();
        }
    }
    //change network to BSC MaiNet
    const changeToBSCTestNet = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(97).toString(16)}` }],
            });
            setNetwork('tBNB');
            setSuccess('Network Changed to BSC TestNet');
            toastSuccess();
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${Number(97).toString(16)}`,
                                chainName: 'Binance Smart Chain Testnet',
                                nativeCurrency: {
                                    name: "Binance Chain Native Token",
                                    symbol: "tBNB",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "https://data-seed-prebsc-1-s1.binance.org:8545",
                                    "https://data-seed-prebsc-2-s1.binance.org:8545",
                                    "https://data-seed-prebsc-1-s2.binance.org:8545",
                                    "https://data-seed-prebsc-2-s2.binance.org:8545",
                                    "https://data-seed-prebsc-1-s3.binance.org:8545",
                                    "https://data-seed-prebsc-2-s3.binance.org:8545"
                                ],
                                blockExplorerUrls: ["https://testnet.bscscan.com"]
                            },
                        ],
                    });
                } catch (addError) {
                    setError(addError.message);
                    toastError();
                }
            }

            setError(switchError.message);
            toastError();
        }
    }

    //Transaction handler
    const transferhandler = () => {

        try {
            window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            from: walletAdrres,
                            to: reciever,
                            gas: '0x76c0',
                            gasPrice: '0x6aa790224',
                            value: "0x" + Number(Web3.utils.toWei(amount, "ether")).toString(16), // 2441406250
                            data:
                                '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
                        },
                    ],
                })
                .then((result) => {
                    setTxHash(result);
                    setHashAvailability(true);
                    getBalance();
                    setSuccess('Transaction Complete!');
                    toastSuccess();
                })
                .catch((error) => {
                    setError(error);
                    toastError();
                });
        } catch (error) {
            setError(error);
            toastError();
        }
    }

    //Copy txHash
    const copyTxHash = () => {
        navigator.clipboard.writeText(txHash);
        copyied('txHash Copied!');
    }

    return (
        <div className="page-container">
            <img src={logo} className="logo" alt="logo" />
            <header className="container">
                <h1>
                    My Wallet
                </h1>
                <div className='address-container'>
                    <p>{first}...{last}</p> &nbsp;&nbsp;
                    <img src={copy} className="copy" alt="logo" onClick={copyHandler} />
                </div>

                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                />

                <div className='balance-container'>
                    <p>Balance</p>
                    <h2 className='balance'>{balance} {network}</h2>
                </div>

                <div className='transfer'>
                    <InputDecimal type="text" placeholder="Transfer Amount" className='input' value={amount} onChange={(evt) => { setAmount(evt.target.value); }} />
                    <InputDecimal type="text" placeholder="Reciever Address" className='input' value={reciever} onChange={(evt) => { setReciever(evt.target.value); }} />
                    <button className='btn-send' onClick={transferhandler}>Transfer</button>
                </div>
                <div className='txHash' hidden={isHashAvailable == false}>
                    <small>TxHash</small><br/>
                    <small>{txHash}</small><br/>
                    <img src={copy} className="copytxHash" alt="logo" onClick={copyTxHash} />
                </div>


                <h1 className='switch-title'>Switch Networks</h1>

                <div className='network-switcher'>
                    <div className='content-left'>
                        <h2 className='switch-title'>Main Networks</h2>
                        <button className='btn-network' onClick={changeToEthMainNet}>Ethereum</button>
                        &nbsp; &nbsp; &nbsp;
                        <button className='btn-network' onClick={changeToBSCMainNet}>BSC</button>
                    </div>
                    <div className='content-right'>
                        <h2 className='switch-title'>Test Networks</h2>
                        <button className='btn-network' onClick={changeToEthTestNet}>Rinkeby</button>
                        &nbsp; &nbsp; &nbsp;
                        <button className='btn-network' onClick={changeToBSCTestNet}>BSC</button>
                    </div>
                </div>

            </header>
        </div>
    );
}

export default Dashboard;