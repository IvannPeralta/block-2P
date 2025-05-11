import { ethers } from "ethers";

export default function Marketplace({ currentAccount, connectWallet, mintInitialBatch, marketItems, purchase }) {
  return (
    <div className="marketplace-container">
      <h1>Marketplace NFTs</h1>

      {!currentAccount ? (
        <>
          <div className="btn-group">
            <button className="primary" onClick={connectWallet}>Conectar Wallet</button>
          </div>
          <p>Conecta tu wallet para ver los NFTs disponibles.</p>
        </>
      ) : (
        <>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
            <p style={{fontSize: '0.9em', color: '#10b981', margin: 0}}>
              Conectado: {currentAccount && `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`}
            </p>
            <button className="secondary" onClick={mintInitialBatch}> Mint inicial</button>
          </div>

          <h2>Items en venta:</h2>
          <div className="nft-grid">
            {marketItems.map((item) => (
              <div key={item.tokenId} className="nft-card">
                <img src={`https://via.placeholder.com/150?text=NFT+${item.tokenId}`} alt={`NFT ${item.tokenId}`} />
                <p>ID: {item.tokenId}</p>
                <p style={{ wordBreak: 'break-word', fontSize: '0.8em' }}>Vendedor: {item.seller}</p>
                <p>Precio: {ethers.formatEther(item.price)} ETH</p>
                <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: item.isSold ? '#dc2626' : '#16a34a',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {item.isSold ? "Vendido" : "Disponible"}
              </span>
                {!item.isSold && (
                  <button className="buy" onClick={() => purchase(item.tokenId, item.price)}>
                    Comprar
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
