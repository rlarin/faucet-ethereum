import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import loadContract from './utils/loadContract';
import { faIdCard, faMoneyBill1, faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import IconButton from './components/IconButton';

function App() {
  const [account, setAccount] = useState({});
  const [web3Api, setWeb3Api] = useState({});

  const getBalance = useCallback(
    async unit => {
      const { web3, contract } = web3Api;
      return web3.utils.fromWei(await web3.eth.getBalance(contract.address), unit);
    },
    [web3Api]
  );

  const connectWallet = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Get MetaMask!');
    } else {
      const currentAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const currentBalance = await getBalance('ether');
      return {
        address: currentAccounts[0],
        balance: currentBalance
      };
    }
  }, [getBalance]);

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

  const setAccountListener = provider => {
    provider.on('accountsChanged', accounts => {
      setAccount(prev => ({
        ...prev,
        address: accounts[0]
      }));
    });
    provider.on('chainChanged', chainId => {
      console.log(chainId);
    });
  };

  useEffect(() => {
    console.log('loadProvider');
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const { instance: contract } = await loadContract('Faucet', provider);

        if (provider) {
          setAccountListener(provider);
          setWeb3Api({
            web3: new Web3(provider),
            provider,
            contract,
            isProviderLoaded: true
          });
        } else {
          setWeb3Api(prevState => {
            return {
              ...prevState,
              isProviderLoaded: true
            };
          });
          alert('Please install MetaMask!');
        }
      } else {
        setWeb3Api(prevState => {
          return {
            ...prevState,
            isProviderLoaded: true
          };
        });
      }
    };

    loadProvider().then();
  }, []);

  const addFunds = useCallback(async () => {
    const {
      contract: { addFunds },
      web3
    } = web3Api;
    await addFunds({ from: account.address, value: web3.utils.toWei('1', 'ether') });
    const balance = await getBalance('ether');
    setAccount(prev => ({
      ...prev,
      balance
    }));
  }, [account.address, web3Api, getBalance]);

  const withdrawFunds = useCallback(async () => {
    const {
      contract: { withdrawFunds: withdraw },
      web3
    } = web3Api;
    const withdrawAmount = web3.utils.toWei('0.1', 'ether');
    await withdraw(withdrawAmount, {
      from: account.address
    });
    const balance = await getBalance('ether');
    setAccount(prev => ({
      ...prev,
      balance
    }));
  }, [account.address, web3Api, getBalance]);

  const donateHandler = () => {
    return addFunds();
  };

  const withdrawHandler = () => {
    return withdrawFunds();
  };

  return (
    <div className="App faucet-wrapper container is-fluid">
      <div className="faucet">
        <div className="balance-view is-size-2">
          {!web3Api.isProviderLoaded && <div className={'button is-loading'}></div>}

          {web3Api.isProviderLoaded && (
            <div>
              {account.address ? (
                <div className="content is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
                  <div>
                    Contract Balance: <strong>{account?.balance || 0}</strong>{' '}
                    <span className="is-size-5">ETH</span>
                  </div>
                  <small className="has-text-centered is-size-5">
                    <strong>Account:</strong> {account.address}
                  </small>
                </div>
              ) : !web3Api?.provider ? (
                <div className="content is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
                  <div className="notification is-warning is-rounded is-small is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
                    <h6 className={'is-size-5'}>Wallet not connected. Please install MetaMask!</h6>
                    <a
                      className={'is-size-5 has-text-link has-text-centered'}
                      target={'_blank'}
                      href={'https://metamask.io/download.html'}
                      rel="noreferrer">
                      Download MetaMask
                    </a>
                  </div>
                </div>
              ) : (
                <div className="content is-justify-content-center is-align-content-center">
                  No wallet connected
                </div>
              )}

              <div className="buttons content is-justify-content-center is-align-content-center">
                {!account.address && web3Api?.provider && (
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
                      text="Donate 1 ETH"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
