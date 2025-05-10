import { ethers } from "ethers";

export default function Marketplace({ currentAccount, connectWallet, mintInitialBatch, marketItems, purchase }) {
  return (
    <div style={{ padding: 20, width: "100vh"}}>
      <h1>Marketplace NFTs</h1>
      {!currentAccount ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <p>Conectado: {currentAccount}</p>
      )}

      <button onClick={mintInitialBatch}>Mint inicial (solo test)</button>

      <h2>Items en venta:</h2>
      {marketItems.map((item) => (
        <div key={item.tokenId} style={{ border: "1px solid black", marginBottom: 10, padding: 10 }}>
          <p>ID: {item.tokenId}</p>
          <p>Vendedor: {item.seller}</p>
          <p>Precio: {ethers.formatEther(item.price)} ETH</p>
          <p>Estado: {item.isSold ? "Vendido" : "Disponible"}</p>
          {!item.isSold && (
            <button onClick={() => purchase(item.tokenId, item.price)}>
              Comprar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
