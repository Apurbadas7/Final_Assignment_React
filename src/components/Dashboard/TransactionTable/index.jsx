import React from 'react';

const TransactionTable = () => {
  const transactions = [
    { id: 'TXN12345678', date: 'Oct 24, 2023', merchant: 'Amazon Pay', amount: '₹ 1,250.00', status: 'Success' },
    { id: 'TXN12345679', date: 'Oct 23, 2023', merchant: 'Flipkart', amount: '₹ 8,400.00', status: 'Failed' },
    { id: 'TXN12345680', date: 'Oct 22, 2023', merchant: 'Zomato', amount: '₹ 450.00', status: 'Processing' },
    { id: 'TXN12345681', date: 'Oct 22, 2023', merchant: 'Swiggy', amount: '₹ 320.00', status: 'Success' },
    { id: 'TXN12345682', date: 'Oct 21, 2023', merchant: 'Uber India', amount: '₹ 1,100.00', status: 'Success' },
  ];

  return (
    <div className="data-card">
      <div className="data-header">
        <h3>Recent Transactions</h3>
        <button className="view-all-btn" style={{ color: 'var(--primary-blue)', fontSize: '0.8rem', fontWeight: 600 }}>
          View All
        </button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.date}</td>
              <td style={{ fontWeight: 500 }}>{txn.id}</td>
              <td>{txn.merchant}</td>
              <td style={{ fontWeight: 600 }}>{txn.amount}</td>
              <td>
                <span className={`status-badge status-${txn.status.toLowerCase()}`}>
                  {txn.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
