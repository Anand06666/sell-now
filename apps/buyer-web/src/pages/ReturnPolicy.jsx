import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h1>
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm space-y-6 text-gray-700 leading-relaxed">
                    <p>
                        At Sell Now, we strive to ensure you are completely satisfied with your purchase. If you are not entirely happy with your order, we're here to help.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">7-Day Replacement/Return</h2>
                    <p>
                        Most items purchased on Sell Now are eligible for return or replacement within 7 days of delivery.
                        Please check the specific product page for eligibility, as some hygiene or personal care items may be non-returnable.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">Eligibility for Returns</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>The item must be unused and in the same condition that you received it.</li>
                        <li>It must be in the original packaging with all tags and labels intact.</li>
                        <li>You must have the receipt or proof of purchase.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">Process</h2>
                    <p>
                        To initiate a return, please go to "My Orders," select the order, and click on "Return/Exchange."
                        Our courier partner will pick up the item within 2-3 business days. Once the item reaches our warehouse and passes quality checks, your refund will be processed.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">Refunds</h2>
                    <p>
                        Refunds will be processed to the original payment method within 5-7 business days after approval.
                        For Cash on Delivery orders, you will be asked to provide bank details for the refund transfer.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
