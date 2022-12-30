import './App.css';
import { faMoneyBill1, faShareFromSquare, faIdCard } from '@fortawesome/free-regular-svg-icons';
import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import IconButton from './components/IconButton';

function App() {
  const [account, setAccount] = useState({});
  const [web3Api, setWeb3Api] = useState({});

  const connectWallet = useCallback(async () => {
    const { ethereum } = window;
    const { web3 } = web3Api;
    if (!ethereum) {
      alert('Get MetaMask!');
    } else {
      const currentAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const currentBalance = await web3.eth.getBalance(currentAccounts[0]);
      return {
        address: currentAccounts[0],
        balance: web3.utils.fromWei(currentBalance, 'ether')
      };
    }
  }, [web3Api]);

  const connectWalletHandler = useCallback(
    async (event = null) => {
      const isConnected = await web3Api.web3?.eth.currentProvider.isConnected();
      if ((!account.address && event) || (!account.address && isConnected)) {
        const { address, balance } = await connectWallet();
        setAccount(prev => ({
          ...prev,
          address,
          balance
        }));
      }
    },
    [account, connectWallet, web3Api]
  );

  useEffect(() => {
    const init = async () => {
      await connectWalletHandler();
    };
    init().then();
  }, [connectWalletHandler]);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider
        });
      } else {
        alert('Please install MetaMask!');
      }
    };

    loadProvider().then();
  }, []);

  const donateHandler = () => {
    console.log('Donate');
  };

  const withdrawHandler = () => {
    console.log('Withdraw');
  };

  return (
    <div className="App faucet-wrapper container is-fluid">
      <div className="faucet">
        <div className="balance-view is-size-2">
          {account.address ? (
            <div className="content is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
              <div>
                Current Balance: <strong>{account?.balance || 0}</strong>{' '}
                <span className="is-size-5">ETH</span>
              </div>
              <small className="has-text-centered is-size-5">Account: {account.address}</small>
            </div>
          ) : (
            <div className="content is-justify-content-center is-align-content-center">
              No wallet connected
            </div>
          )}

          <div className="buttons content is-justify-content-center is-align-content-center">
            {!account.address && (
              <IconButton
                onClickHandler={connectWalletHandler}
                icon={faIdCard}
                text="Connect Wallet"
                color="is-primary"
              />
            )}
            {account.address && (
              <>
                <IconButton
                  onClickHandler={donateHandler}
                  icon={faMoneyBill1}
                  text="Donate"
                  color="is-info"
                />
                <IconButton
                  onClickHandler={withdrawHandler}
                  icon={faShareFromSquare}
                  text="Withdraw"
                  color="is-success"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
