"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import OrderStatusBar from "@/app/pages/OrderStatusBar";

// INR formatter
const formatINR = (num) =>
  `Rs.${Number(num).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // fallback empty array on error
    }
  };

  fetchOrders();
}, []);

  

function CopyableText({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <span
      onClick={handleCopy}
      title={copied ? "Copied!" : "Click to copy"}
      className="font-mono cursor-pointer select-all bg-gray-100 px-1 rounded"
    >
      {text}
    </span>
  );
}


  // Invoice generator (you can move this to separate file if needed)
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Ø>Ýþ Store", margin, y);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text("Invoice", margin, y);

    doc.setFontSize(10);
    y += 5;
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, margin, y);
    doc.text(`Order ID: ${order.orderId}`, 200 - margin, y, { align: "right" });

    y += 5;
    doc.text(`Payment ID: ${order.paymentId}`, 200 - margin, y, { align: "right" });

    const deliveryDate = new Date(order.orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    y += 5;
    doc.text(`Est. Delivery: ${deliveryDate.toLocaleDateString()}`, 200 - margin, y, { align: "right" });

    y += 8;
    doc.line(margin, y, 200 - margin, y);
    y += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", margin, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 5;

    const { fullName, email, phone, address } = order.customer;
    [ `Name: ${fullName}`, `Email: ${email}`, `Phone: ${phone}`, `Address: ${address}` ].forEach(line => {
      doc.text(line, margin, y);
      y += 5;
    });

    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Product", "Qty", "Price", "Subtotal"]],
      body: order.items.map(item => [
        item.name,
        item.quantity.toString(),
        formatINR(item.price),
        formatINR(item.price * item.quantity),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [60, 60, 60] },
      margin: { left: margin, right: margin },
    });

    const summaryY = doc.lastAutoTable.finalY + 5;
    const { subtotal, shipping, taxAmount, discountAmount, total, couponCode } = order.pricing;

    const summaryRows = [
      ["Subtotal", formatINR(subtotal)],
      ["Shipping", formatINR(shipping)],
      ["GST (12%)", formatINR(taxAmount)],
    ];

    if (discountAmount > 0) {
      summaryRows.push([`Discount (${couponCode || "applied"})`, `- ${formatINR(discountAmount)}`]);
    }

    summaryRows.push([
      { content: "Total Amount", styles: { fontStyle: "bold", textColor: [0, 0, 0] } },
      { content: formatINR(total), styles: { fontStyle: "bold", textColor: [0, 0, 0] } },
    ]);

    autoTable(doc, {
      startY: summaryY,
      head: [["Summary", "Amount"]],
      body: summaryRows,
      styles: { fontSize: 10 },
      theme: "grid",
      margin: { left: 120, right: margin },
      headStyles: { fillColor: [0, 102, 204] },
      bodyStyles: { textColor: 20 },
    });

    const pageHeight = doc.internal.pageSize.height;
    const sellerY = pageHeight - 35;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Seller Info", margin, sellerY);

    const sellerLines = [
      `Name: Flipzone Distributors`,
      `Email: seller-support@flipzone.in`,
      `Phone: 080-12345678`,
      `Address: Warehouse 12, MIDC, Nashik, MH`,
      `GSTIN: 27ABCDE1234F1Z5`,
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    let sellerYLine = sellerY + 5;
    sellerLines.forEach(line => {
      doc.text(line, margin, sellerYLine);
      sellerYLine += 4.5;
    });

    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      "This is a system-generated invoice. For queries, contact support@yourstore.com",
      margin,
      pageHeight - 5
    );

    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const filteredOrders = orders
    .filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <div className="min-h-screen mx-auto px-4 py-6 bg-gradient-to-br from-slate-600 to-purple-700 w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-white">
        My Orders
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-yellow-200 mt-10 text-lg">
          No orders found{searchTerm ? ` for "${searchTerm}"` : "."}{" "}
          {orders.length === 0 && "Start shopping!"}
        </div>
      ) : (
        <ul className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {filteredOrders.map(order => {
            const expanded = expandedOrderId === order.orderId;
            return (
              <li
                key={order.orderId}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer select-none"
                onClick={() => toggleExpand(order.orderId)}
                aria-expanded={expanded}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(order.orderId);
                  }
                }}
              >

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-amber-600">
                      Order ID: <CopyableText text={order.orderId} />
                    </h2>
                    {order.paymentId && (
                      <p className="text-sm text-gray-700">
                        Payment ID: <CopyableText text={order.paymentId} />
                      </p>
                    )}

                    <time className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleString()}
                    </time>
                   
                    
                  </div>
                  <p className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
                    Total: {formatINR(order.pricing.total)}
                  </p>
                </div>

                {expanded && (
                  <div className="mt-4 border-t border-gray-300 pt-4 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                      {order.items.map(item => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            
                            <div className="truncate">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-800 whitespace-nowrap">
                            {formatINR(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-right text-gray-800 font-semibold space-y-1">
                      <p>Subtotal: {formatINR(order.pricing.subtotal)}</p>
                      <p>Shipping: {formatINR(order.pricing.shipping)}</p>
                      <p>GST (12%): {formatINR(order.pricing.taxAmount)}</p>
                      {order.pricing.discountAmount > 0 && (
                        <p className="text-green-600">
                          Discount: -{formatINR(order.pricing.discountAmount)}
                        </p>
                      )}
                      <p className="text-lg font-bold mt-1">
                        Total: {formatINR(order.pricing.total)}
                      </p>
                    </div>
                    



                    <div className="flex justify-between items-center text-right">
                      
                      <OrderStatusBar currentStatus={order.orderStatus} />
                    
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateInvoice(order);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 px-4 rounded shadow"
                  >
                    Download Invoice
                  </button>
                    </div>
                    
                  {/* --- Cancellation / Return Section --- */}
                    <div className="mt-3 text-center">
                      {order.orderStatus === "pending" ||
                      order.orderStatus === "confirmed" ||
                      order.orderStatus === "processing" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(order.orderId);
                            window.location.href = `http://localhost:3000/pages/contact?orderId=${order.orderId}`;
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-md shadow 
                                    w-full sm:w-auto max-w-[220px] mx-auto block"
                        >
                          Request Cancellation
                        </button>
                      ) : order.orderStatus === "shipped" ? (
                        <p className="text-green-700 font-medium text-center">
                          ✅ Your order has been shipped successfully and cannot be cancelled.
                        </p>
                      ) : order.orderStatus === "delivered" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(order.orderId);
                            window.location.href = `http://localhost:3000/pages/contact?orderId=${order.orderId}`;
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-md shadow 
                                    w-full sm:w-auto max-w-[220px] mx-auto block"
                        >
                          Request Return
                        </button>
                      ) : null}
                    </div>

                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Orders; 