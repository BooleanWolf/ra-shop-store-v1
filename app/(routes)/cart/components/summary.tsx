"use client";

import axios from "axios";
import { useEffect,useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [formData, setFormData] = useState({
    bkashTransactionId: "",
    nagadTransactionId: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const onCheckout = async () => {
    console.log("Form data submitted:", formData);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      productIds: items.map((item) => item.id),
      bkashId: formData.bkashTransactionId,
      nagadId: formData.nagadTransactionId,
      phoneNumber: formData.phoneNumber,
    });

    window.location = response.data.url;
  }

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
        <div className="max-w-md mx-auto mt-5 p-5 bg-white rounded shadow-lg">
          <form>
            <div className="mb-4">
              <label
                className="block mb-2 text-gray-800"
                htmlFor="bkashTransactionId"
              >
                bKash Transaction ID
              </label>
              <input
                type="text"
                id="bkashTransactionId"
                name="bkashTransactionId"
                value={formData.bkashTransactionId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your bKash transaction ID"
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-gray-800"
                htmlFor="nagadTransactionId"
              >
                Nagad Transaction ID
              </label>
              <input
                type="text"
                id="nagadTransactionId"
                name="nagadTransactionId"
                value={formData.nagadTransactionId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your Nagad transaction ID"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-800" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your phone number"
              />
            </div>
          </form>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
}
 
export default Summary;
