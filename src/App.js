import React, { useState, useEffect, useMemo } from "react";
import { useMoralis } from "react-moralis";
import Web3 from 'web3';
import './App.css';

import config from './config';

function App() {
	const [tokenAddress, setTokenAddress] = useState('');
	const [tokenId, setTokenId] = useState('');
	const [price, setPrice] = useState(config.price);

	const [nftUrl, setNftUrl] = useState(config.opensea_url);

	const [snipingStatus, setSnipingStatus] = useState(false);
	const [resStatus, setResStatus] = useState({
		code: 200,
		message: ''
	});

  	const {
		Moralis,
		enableWeb3,
		isInitialized,
		isAuthenticated,
		isWeb3Enabled,
	} = useMoralis();

	useEffect(() => {
		if (isInitialized) {
			Moralis.initPlugins();
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled) {
			enableWeb3();
		}
		// eslint-disable-next-line
	}, [isAuthenticated]);

	const startSniping = async () => {
		if (snipingStatus == false) {
			console.log(snipingStatus);
			return
		}

		try{
			const res = await Moralis.Plugins.opensea.getAsset({
				network: config.network,
				tokenAddress: tokenAddress,
				tokenId: tokenId,
			});

			let orders = res.orders;
			
			if(orders.length == 0) {
				setResStatus({
					code: 200,
					message: 'No NFT for sale'
				});
			} else {
				let currentPrice = Web3.utils.fromWei(orders[0].currentPrice, 'ether')
				
				let currentdate = new Date(); 
				let datetime = "" + currentdate.getDate() + "/"
					+ (currentdate.getMonth()+1)  + "/" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();

				setResStatus({
					code: 200,
					message: `${datetime}: Current Price is ${currentPrice}ETH`
				});
			}
		} catch(err) {
			setResStatus({
				code: err.code,
				message: err.message
			});
			setSnipingStatus(false);
		}

		setTimeout(startSniping, 0);
	};

	const setNftDataFromFullPath = (url) => {
		let parameters = url.replace(/^.*0x/, "0x");
		let p1 = parameters.replace(/\/.*/, "");
		let p2 = parameters.replace(/.*\//, "");
		setTokenAddress(p1);
		setTokenId(p2);
		setNftUrl(url);
	}

	useEffect(() => {
		if(tokenAddress.length == 0 && nftUrl.length > 0) {
			setNftDataFromFullPath(nftUrl);
		}
		if(snipingStatus) {
			startSniping()
		}
	});

	return (
		<div className="App">
			<h1>Welcome To Opensea Sniper Bot</h1>

			<label>NFT URL</label>
			<input
				type="text"
				value={nftUrl} 
				onChange={(e) =>
					setNftDataFromFullPath(e.target.value)
				}
			/>

			<br />

			<label>Entry Price</label>
			<input
				type="text"
				value={price} 
				onChange={(e) =>
					setPrice(e.target.value)
				}
			/>

			<br />
			
			{ 
				snipingStatus 
				? 	<button onClick={() => setSnipingStatus(false)}>Stop Sniping</button> 
				: 	<button onClick={() => setSnipingStatus(true)}>Start Sniping</button>
			}
			
			<br />

			<h1>{ resStatus.message }</h1>
		</div>
	);
}

export default App;
