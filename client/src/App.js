import React, { useEffect, useState, useMemo } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

function App() {
  const [depositValue, setDepositValue] = useState(0);
  const [balance, setBalance] = useState('');
  const [signer, setSigner] = useState(null);

  // Initialize provider and signer
  const provider = useMemo(() => new BrowserProvider(window.ethereum), []);
  const contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const ABI = useMemo(() => [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], []);

  const contract = useMemo(() => new Contract(contractAddr, ABI, signer), [contractAddr, ABI, signer]);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Request accounts
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setSigner(signer);

        // Get contract balance
        const balance = await provider.getBalance(contractAddr);
        setBalance(formatEther(balance));
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initialize();
  }, [provider, contractAddr]);

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!signer) {
        console.error("Signer is not available");
        return;
      }
      const ethValue = parseEther(depositValue.toString());
      const depositTx = await contract.connect(signer).deposit({ value: ethValue });
      await depositTx.wait();
      const balance = await provider.getBalance(contractAddr);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Error during deposit:", error);
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <p>Contract Balance: {balance} ETH</p>
        </div>
        <div className="col">
          <div className="mb-3">
            <h4>Deposit ETH</h4>
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-3">
                <input type="number" className="form-control" placeholder="0" onChange={handleDepositChange} value={depositValue} />
              </div>
              <button type="submit" className="btn btn-success">Deposit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
