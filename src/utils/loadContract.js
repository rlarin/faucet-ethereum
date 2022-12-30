import Faucet from '../contracts/FaucetContract.json';
import Logger from '../contracts/Logger.json';
import contract from '@truffle/contract';

const loadContract = async (name, provider) => {
  let contractInstance = null;
  switch (name) {
    case 'Faucet':
      contractInstance = Faucet;
      break;
    case 'Logger':
      contractInstance = Logger;
      break;
    default:
      break;
  }

  const _contract = contract(contractInstance);
  _contract.setProvider(provider);
  const instance = await _contract.deployed();
  return { instance };
};

export default loadContract;
