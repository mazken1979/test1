import { useState } from "react";
import "./index.css";

export default function App() {
  const [view, setView] = useState("scan");
  const [boxId, setBoxId] = useState("");
  const [scannedItems, setScannedItems] = useState([]);

  const mockData = [
    { sku: "NIK-D800", name: "Nikon D800 Camera Body", qty: 1 },
    { sku: "LENS-50F14", name: "Nikkor 50mm f/1.4 Lens", qty: 2 }
  ];

  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Aucrevo US Warehouse Portal</h1>
        <div className="tabs">
          <button className={view === "scan" ? "active" : ""} onClick={() => setView("scan")}>入庫スキャン</button>
          <button className={view === "stock" ? "active" : ""} onClick={() => setView("stock")}>在庫一覧</button>
        </div>
      </header>

      {view === "scan" && (
        <section className="card">
          <h2>入庫スキャン</h2>
          <input placeholder="箱番号" value={boxId} onChange={(e) => setBoxId(e.target.value)} />
          <button onClick={() => setScannedItems(mockData)}>確認</button>
          {scannedItems.length > 0 && (
            <table className="table">
              <thead><tr><th>SKU</th><th>商品名</th><th>数量</th></tr></thead>
              <tbody>
                {scannedItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {view === "stock" && (
        <section className="card">
          <h2>在庫一覧</h2>
          <p>在庫データはここに表示されます。</p>
        </section>
      )}
    </div>
  );
}
