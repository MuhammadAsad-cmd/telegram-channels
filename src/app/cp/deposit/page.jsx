"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";

const paymentOptions = [
  { id: "ton", label: "Toncoin", icon: "TON" },
  { id: "btc", label: "Bitcoin", icon: "₿" },
  { id: "ltc", label: "Litecoin", icon: "Ł" },
  { id: "doge", label: "Dogecoin", icon: "Ð" },
  { id: "usdt", label: "USDT (TRC20 | Minimum $200)", icon: "₮" },
];

export default function CpDepositPage() {
  const [selectedPayment, setSelectedPayment] = useState("ton");
  const [amount, setAmount] = useState("");

  const handlePay = (e) => {
    e.preventDefault();
    console.log("Pay:", { selectedPayment, amount });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CpCard className="px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <p className="text-xl font-semibold text-gray-800">$0.00</p>
          </div>
        </CpCard>
      </div>

      <CpCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Top up Account Balance
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          You can top up your account balance and use it to create ads or
          feature your media. The balance is{" "}
          <span className="text-accent-red font-medium">not refundable</span>.
        </p>

        <form onSubmit={handlePay} className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Pay With:</h3>
            <div className="space-y-2">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPayment === option.id
                      ? "border-accent-primary bg-accent-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={selectedPayment === option.id}
                    onChange={() => setSelectedPayment(option.id)}
                    className="text-accent-primary"
                  />
                  <span className="text-lg font-medium text-gray-400">
                    {option.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row items-start">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="minimum is $10"
                min="10"
                step="1"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-accent-secondary hover:bg-accent-secondary/90 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Pay
            </button>
          </div>
        </form>
      </CpCard>
    </div>
  );
}
