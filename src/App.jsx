import { useState } from "react";

export default function App() {
  const [view, setView] = useState("scan");
  const [boxId, setBoxId] = useState("");
  const [scannedItems, setScannedItems] = useState([]);

  const invoices = [
    { invoiceId: "INV-202509", month: "2025-09", customer: "Camera Shop A", orderId: "US12345", service: "UPS Ground", boxId: "BOX-202509-0001", declaredUSD: 1200, weightLb: 8.2, postageUSD: 24.5, surchargeUSD: 3.2, insuranceUSD: 1.2, handlingUSD: 2, fx: 151.2 },
    { invoiceId: "INV-202509", month: "2025-09", customer: "Camera Shop A", orderId: "US12367", service: "USPS Priority", boxId: "BOX-202509-0005", declaredUSD: 300, weightLb: 3.1, postageUSD: 12.7, surchargeUSD: 0, insuranceUSD: 0.6, handlingUSD: 2, fx: 151.2 }
  ];

  const shipmentsHistory = [
    { date: "2025-09-28", orderId: "US12345", sku: "NIK-D800", qty: 1, carrier: "UPS", service: "Ground", tracking: "1Z999AA10123456784", to: "CA, US", status: "Delivered" },
    { date: "2025-09-30", orderId: "US12367", sku: "LENS-50F14", qty: 1, carrier: "USPS", service: "Priority", tracking: "9400 1000 0000 0000 0000 00", to: "NY, US", status: "In Transit" }
  ];

  const members = [
    { memberId: "M001", name: "Camera Shop A", email: "owner@shop-a.example", suspended: false, balance_due_jpy: 0 },
    { memberId: "M002", name: "Vintage Lens B", email: "contact@lens-b.example", suspended: true, balance_due_jpy: 15400 }
  ];
  const currentMemberSuspended = members.find(m => m.memberId === "M001")?.suspended ?? false;

  const mockData = [
    { sku: "NIK-D800", name: "Nikon D800 Camera Body", qty: 1, thumb: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=256" },
    { sku: "LENS-50F14", name: "Nikkor 50mm f/1.4 Lens", qty: 2, thumb: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=256" }
  ];

  const totalJPY = (row) =>
    Math.round((row.postageUSD + row.surchargeUSD + row.insuranceUSD + row.handlingUSD) * row.fx);

  const exportCSV = (rows, filename) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Aucrevo US Warehouse Portal</h1>
        <div className="tabs">
          <button className={view==="scan"?"active":""} onClick={()=>setView("scan")}>入庫スキャン</button>
          <button className={view==="stock"?"active":""} onClick={()=>setView("stock")}>在庫一覧</button>
          <button className={view==="ship"?"active":""} onClick={()=>setView("ship")}>発送依頼</button>
          <button className={view==="invoice"?"active":""} onClick={()=>setView("invoice")}>請求(PDF/CSV)</button>
          <button className={view==="history"?"active":""} onClick={()=>setView("history")}>発送履歴</button>
          <button className={view==="members"?"active":""} onClick={()=>setView("members")}>会員</button>
        </div>
      </header>

      {view === "scan" && (
        <section className="card">
          <h2>入庫スキャン</h2>
          <p>箱番号をスキャンまたは入力してください。</p>
          <div className="row">
            <input placeholder="BOX-202510-0001" value={boxId} onChange={e=>setBoxId(e.target.value)} />
            <button onClick={()=>setScannedItems(mockData)}>確認</button>
          </div>
          {scannedItems.length>0 &&
            <table className="table">
              <thead><tr><th>画像</th><th>SKU</th><th>商品名</th><th>数量</th></tr></thead>
              <tbody>
                {scannedItems.map((it,i)=>(
                  <tr key={i}>
                    <td><img src={it.thumb} alt={it.sku} className="thumb" /></td>
                    <td>{it.sku}</td>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </section>
      )}

      {view === "stock" && (
        <section className="card">
          <h2>在庫一覧</h2>
          <table className="table">
            <thead><tr><th>画像</th><th>SKU</th><th>商品名</th><th>在庫数</th><th>ロケーション</th></tr></thead>
            <tbody>
              <tr>
                <td><img className="thumb" src="https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=128" alt="NIK-D800" /></td>
                <td>NIK-D800</td><td>Nikon D800 Camera Body</td><td>3</td><td>Shelf A3</td>
              </tr>
              <tr>
                <td><img className="thumb" src="https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=128" alt="LENS-50F14" /></td>
                <td>LENS-50F14</td><td>Nikkor 50mm f/1.4 Lens</td><td>5</td><td>Shelf B1</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {view === "ship" && (
        <section className="card">
          <h2>発送依頼</h2>
          {currentMemberSuspended && (
            <div className="alert">料金未納により発送が停止されています。お支払い完了後に再開されます。</div>
          )}
          <div className="grid2">
            <input placeholder="宛名 (Name)" />
            <input placeholder="郵便番号 (ZIP)" />
            <input placeholder="住所 (Address Line 1)" />
            <input placeholder="住所2 (Address Line 2)" />
            <input placeholder="都市 (City)" />
            <input placeholder="国 (Country)" />
          </div>
          <button className="primary" disabled={currentMemberSuspended}>発送依頼を送信</button>
        </section>
      )}

      {view === "invoice" && (
        <section className="card">
          <h2>請求（PDF/CSV）</h2>
          <div className="row">
            <input placeholder="請求月 (YYYY-MM) 例: 2025-09" />
            <input placeholder="顧客名 検索" />
            <button onClick={()=>exportCSV(invoices,"invoice_lines.csv")}>CSVエクスポート</button>
            <button onClick={()=>window.print()}>PDF出力(モック)</button>
          </div>
          <table className="table">
            <thead><tr><th>Invoice</th><th>Month</th><th>Customer</th><th>Order</th><th>Service</th><th>Box</th><th>Postage USD</th><th>FX</th><th>Total JPY</th></tr></thead>
            <tbody>
              {invoices.map((r,i)=>(
                <tr key={i}>
                  <td>{r.invoiceId}</td><td>{r.month}</td><td>{r.customer}</td><td>{r.orderId}</td>
                  <td>{r.service}</td><td>{r.boxId}</td>
                  <td>{(r.postageUSD + r.surchargeUSD + r.insuranceUSD + r.handlingUSD).toFixed(2)}</td>
                  <td>{r.fx}</td><td>{totalJPY(r).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view === "history" && (
        <section className="card">
          <h2>発送履歴</h2>
          <div className="grid3">
            <input placeholder="開始日 YYYY-MM-DD" />
            <input placeholder="終了日 YYYY-MM-DD" />
            <input placeholder="検索（注文ID/追跡番号）" />
          </div>
          <table className="table">
            <thead><tr><th>日付</th><th>注文ID</th><th>SKU</th><th>数量</th><th>キャリア/サービス</th><th>追跡番号</th><th>宛先</th><th>ステータス</th></tr></thead>
            <tbody>
              {shipmentsHistory.map((s,i)=>(
                <tr key={i}>
                  <td>{s.date}</td><td>{s.orderId}</td><td>{s.sku}</td><td>{s.qty}</td>
                  <td>{s.carrier} / {s.service}</td><td>{s.tracking}</td><td>{s.to}</td><td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view === "members" && (
        <section className="card">
          <h2>会員管理</h2>
          <table className="table">
            <thead><tr><th>会員ID</th><th>名称</th><th>メールアドレス</th><th>未納額(JPY)</th><th>発送状態</th><th>操作</th></tr></thead>
            <tbody>
              {members.map((m,i)=>(
                <tr key={i}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>
                    <div className="row">
                      <input defaultValue={m.email} />
                      <button>保存</button>
                    </div>
                  </td>
                  <td>{m.balance_due_jpy.toLocaleString()}</td>
                  <td>{m.suspended ? "停止中" : "稼働中"}</td>
                  <td><button className={m.suspended?"":"danger"}>{m.suspended?"発送再開":"発送停止"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
