import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceABI from "./MarketplaceABI.json";
import Marketplace from "./Marketplace.jsx";


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [marketItems, setMarketItems] = useState([]);

  // Conectar Wallet
  async function connectWallet() {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
      const signer = await ethProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MarketplaceABI, signer);

      setProvider(ethProvider);
      setSigner(signer);
      setContract(contract);
    } else {
      alert("Instala MetaMask");
    }
  }

  // Cargar NFTs listados
  async function loadMarketItems() {
    if (!contract) return;

    const items = [];
    for (let i = 1; i < 11; i++) {  // ejemplo para 10 NFTs iniciales
      try {
        const [seller, price, isSold] = await contract.getListing(i);
        if (seller !== ethers.ZeroAddress) {
          let tokenUri = await contract.tokenURI(i);
          if (tokenUri.startsWith("ipfs://")) {
            tokenUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          }
          const response = await fetch(tokenUri);
          const metadata = await response.json();
          const imageUrl = ipfsToHttp(metadata.image);
          items.push({  tokenId: i, 
                        seller, 
                        price, 
                        isSold, 
                        image: imageUrl, 
                        name: metadata.name  });
        }
      } catch (err) {
        continue; // Si el token no existe, ignorar
      }
    }
    setMarketItems(items);
  }

  // Comprar NFT
  async function purchase(tokenId, price) {
    if (!contract) return;
    const tx = await contract.buy(tokenId, { value: price });
    await tx.wait();
    loadMarketItems();
  }

  // Mint inicial (opcional para test)
  async function mintInitialBatch() {
    if (!contract) return;
    for (let i = 1; i < 11; i++) {
      const uri = `ipfs://bafybeigmal6ly6u6xq7r5fkt5bgqd4cb3kyc663ubq2kgvgv7wlmp34imq/nft${i}.json`; // Reemplaza con tu URL
      const price = ethers.parseEther("5");
      await (await contract.mintAndList(uri, price)).wait();
    }
    loadMarketItems();
  }

  function ipfsToHttp(url) {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  }


  useEffect(() => {
    if (contract) {
      loadMarketItems();
    }
  }, [contract]);

  return (
  <Marketplace
    currentAccount={currentAccount}
    connectWallet={connectWallet}
    mintInitialBatch={mintInitialBatch}
    marketItems={marketItems}
    purchase={purchase}
  />
  );
}

export default App;
