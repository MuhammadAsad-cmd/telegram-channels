"use client";

import { useState, useEffect } from "react";
import { Coins, Upload, Wallet } from "lucide-react";
import Image from "next/image";
import CpCard from "@/components/Cp/CpCard";
import { fetchCrypto, createRequest } from "@/lib/api/requestService";
import { getProfile } from "@/lib/api/userService";
import { toast } from "sonner";

export default function CpDepositPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data?.data ?? res.data;
        const wallet = user?.wallet;
        setBalance(typeof wallet === "number" ? wallet : typeof wallet === "string" ? parseFloat(wallet) || 0 : 0);
      })
      .catch(() => setBalance(0));
  }, []);

  useEffect(() => {
    fetchCrypto()
      .then((res) => {
        const list = res.data?.data ?? [];
        setPaymentMethods(Array.isArray(list) ? list : []);
        if (list?.length && !selectedCrypto) {
          setSelectedCrypto(list[0]._id);
        }
      })
      .catch(() => toast.error("Failed to load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (paymentMethods.length && !selectedCrypto) {
      setSelectedCrypto(paymentMethods[0]._id);
    }
  }, [paymentMethods, selectedCrypto]);

  const handleEvidenceChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      setEvidencePreview(URL.createObjectURL(file));
    } else {
      setEvidenceFile(null);
      setEvidencePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCrypto) {
      toast.error("Please select a payment method");
      return;
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!evidenceFile) {
      toast.error("Please upload payment evidence (screenshot/receipt)");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("crypto", selectedCrypto);
    formData.append("amount", String(num));
    formData.append("evidence", evidenceFile);

    createRequest(formData)
      .then(() => {
        toast.success("Request submitted successfully. We will review it shortly.");
        setAmount("");
        setEvidenceFile(null);
        setEvidencePreview(null);
        getProfile()
          .then((res) => {
            const user = res.data?.data ?? res.data;
            const wallet = user?.wallet;
            setBalance(typeof wallet === "number" ? wallet : typeof wallet === "string" ? parseFloat(wallet) || 0 : 0);
          })
          .catch(() => {});
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ??
          err.response?.data?.error ??
          "Failed to submit request";
        toast.error(typeof msg === "string" ? msg : "Failed to submit request");
      })
      .finally(() => setSubmitting(false));
  };

  const selectedMethod = paymentMethods.find((p) => p._id === selectedCrypto);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CpCard className="px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <p className="text-xl font-semibold text-gray-800">
              ${balance != null ? Number(balance).toFixed(2) : "0.00"}
            </p>
          </div>
        </CpCard>
      </div>

      <CpCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Top up Account Balance
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Select a payment method, enter the amount, and upload proof of payment.
          The balance is{" "}
          <span className="text-accent-red font-medium">not refundable</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Payment method</h3>
            {loading ? (
              <div className="flex gap-2">
                <div className="h-14 w-32 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-14 w-32 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <p className="text-gray-500 text-sm">No payment methods available.</p>
            ) : (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method._id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCrypto === method._id
                        ? "border-accent-primary bg-accent-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="crypto"
                      value={method._id}
                      checked={selectedCrypto === method._id}
                      onChange={() => setSelectedCrypto(method._id)}
                      className="text-accent-primary"
                    />
                    {method.paymentImage ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={method.paymentImage}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">
                        {method.title || "Payment"}
                      </span>
                      {method.paymentId && (
                        <span className="text-xs text-gray-500 font-mono truncate max-w-[200px] block">
                          {method.paymentId}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedMethod?.paymentId && (
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Send to this address / ID:</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                {selectedMethod.paymentId}
              </p>
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-800 mb-2">Amount</label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 20"
                min="1"
                step="any"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-2">
              Evidence (screenshot / receipt) <span className="text-accent-red">*</span>
            </label>
            <div className="flex items-start gap-4">
              <label className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-accent-primary/50 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 transition-colors shrink-0">
                {evidencePreview ? (
                  <Image
                    src={evidencePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="96px"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEvidenceChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              <div>
                <p className="text-sm text-gray-600">
                  {evidenceFile?.name ?? "No file selected"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  JPG, PNG or similar. Proof of your payment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row items-start pt-2">
            <button
              type="submit"
              disabled={submitting || loading || paymentMethods.length === 0}
              className="px-8 py-3 cursor-pointer bg-accent-secondary hover:bg-accent-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Submit Request
            </button>
          </div>
        </form>
      </CpCard>
    </div>
  );
}
