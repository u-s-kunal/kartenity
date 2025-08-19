"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../main/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TAX_RATE = 0.12;
const VALID_COUPONS = {
  SAVE10: 0.1,
  FLAT500: 500,
};

const RAZORPAY_KEY = "rzp_test_eOeFm7dL3YKhTr"; // Your Razorpay Test Key here

const formatINR = (num) => {
  let x = num.toFixed(2).toString();
  let afterDecimal = x.split(".")[1];
  let beforeDecimal = x.split(".")[0];
  let lastThree = beforeDecimal.slice(-3);
  let otherNumbers = beforeDecimal.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + "." + afterDecimal;
  if (afterDecimal === "00") return formatted.slice(0, -3);
  return formatted;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ---- New email sending function added here ----
const sendOrderEmail = async (order) => {
  try {
    const response = await fetch("http://localhost:5000/api/email/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });

    if (response.ok) {
      toast.success("Order confirmation email sent successfully!");
    } else {
      const errorText = await response.text();
      console.error("Email send failed:", response.status, errorText);
      toast.error(`Failed to send order confirmation email. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send order email:", error);
    toast.error("Error sending order confirmation email.");
  }
};


const CheckoutPage = () => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [orderPlacedMsg, setOrderPlacedMsg] = useState("");

  // Load from Redux when available
  useEffect(() => {
    setCart(reduxCart);
  }, [reduxCart]);

  // ✅ Load from localStorage on refresh
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error("Error parsing stored cart:", err);
      }
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const hasExpensiveItem = cart.some((item) => item.price > 500);
  const shipping = subtotal > 0 && !hasExpensiveItem ? 50 : 0;
  const taxAmount = (subtotal + shipping) * TAX_RATE;

  let discountAmount = 0;
  if (discount > 0 && couponCode) {
    if (discount < 1) {
      discountAmount = (subtotal + shipping + taxAmount) * discount;
    } else {
      discountAmount = discount;
    }
  }
  const total = subtotal + shipping + taxAmount - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code in VALID_COUPONS) {
      setDiscount(VALID_COUPONS[code]);
      setCouponMessage(`Coupon '${code}' applied successfully!`);
      toast.success(`Coupon '${code}' applied!`);
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code.");
      toast.error("Invalid coupon code.");
    }
  };

  const saveOrderPaymentDetails = async (payment_id, razorpay_order_id) => {
  const order = {
    orderId: razorpay_order_id,
    paymentId: payment_id,
    customer: { fullName, email, phone, address },
    items: cart,
    pricing: {
      subtotal,
      shipping,
      taxAmount,
      discountAmount,
      total,
      couponCode: couponCode.trim().toUpperCase(),
    },
    payment: "Paid",
    orderStatus:"pending",
    orderDate: new Date().toISOString(),
  };

  console.log("Saving order:", order);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Orders`, {  // use full backend URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save order");
    }

    const savedOrder = await response.json();

    sendOrderEmail(savedOrder);

  } catch (error) {
    console.error("Save order error:", error.message);
    // Show toast or UI error here
  }
};



  const initiateRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/payment/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      const data = await response.json();
      if (!data.id) {
        toast.error("Failed to create payment order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount.toString(),
        currency: data.currency,
        name: "Your Shop Name",
        description: "Order Payment",
        order_id: data.id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        handler: function (response) {
          toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

          saveOrderPaymentDetails(response.razorpay_payment_id, response.razorpay_order_id);

          dispatch(clearCart());
          localStorage.removeItem("cart");
          setCart([]);
          setFullName("");
          setEmail("");
          setPhone("");
          setAddress("");
          setCouponCode("");
          setDiscount(0);
          setCouponMessage("");
          setOrderPlacedMsg(
            `Order placed & payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment popup closed.");
          },
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Error initiating payment. Please try again later.");
      setLoading(false);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlacedMsg("");
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!fullName || !email || !phone || !address) {
      toast.error("Please fill in all shipping information.");
      return;
    }
    initiateRazorpayPayment();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
      <div className="min-h-screen bg-gradient-to-br from-stone-800 to-orange-800 p-6 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Cart Summary Card */}
          <div className="bg-transparent shadow-2xl rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="">No products in cart.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `http://localhost:5000${item.image}`
                          }
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-white">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-whitex font-medium">
                      ₹{formatINR(item.price * item.quantity)}
                    </p>
                  </div>
                ))}

                {/* Coupon Code */}
                <form
                  onSubmit={handleApplyCoupon}
                  className="mt-4 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponMessage("");
                    }}
                    className="flex-grow px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Apply
                  </button>
                </form>
                {couponMessage && (
                  <p
                    className={`mt-1 text-sm ${
                      discount > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}

                {/* Pricing Summary */}
                <div className="mt-6 border-t pt-4 text-right space-y-2 text-white font-semibold">
                  <p className="text-gray-300">Subtotal: ₹{formatINR(subtotal)}</p>
                  <p className="text-gray-300">Shipping: ₹{formatINR(shipping)}</p>
                  <p className="text-gray-300">GST (12%): ₹{formatINR(taxAmount)}</p>
                  {discountAmount > 0 && (
                    <p className="text-green-400">Discount: -₹{formatINR(discountAmount)}</p>
                  )}
                  <p className="text-xl font-bold bg-black p-2 rounded">
                    Total: ₹{formatINR(total > 0 ? total : 0)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Form */}
          <div className="bg-transparent shadow-2xl rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Shipping Info</h2>
            <form className="space-y-4" onSubmit={handlePlaceOrder}>
              <div>
                <label className="block text-sm font-medium text-white">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Phone</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  title="Enter a valid 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Address</label>
                <textarea
                  rows="3"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={cart.length === 0 || loading}
                className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${
                  cart.length === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing Payment..." : "Place Order"}
              </button>
            </form>
            {orderPlacedMsg && (
              <p className="mt-4 text-green-400 font-semibold text-center">{orderPlacedMsg}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
