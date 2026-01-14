import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                        Customer Policy
                    </h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                SellNow is an online marketplace platform that allows customers to browse, purchase, and receive
                                products from registered sellers. This Customer Policy outlines the rights, responsibilities, and
                                conditions applicable to users purchasing products on the SellNow platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Account & Usage</h2>
                            <p>
                                Customers must provide accurate information while creating an account. Any misuse, fraudulent
                                activity, or violation of platform rules may result in account suspension.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Orders & Payments</h2>
                            <p>
                                All orders placed on SellNow are subject to product availability and successful payment
                                confirmation. Prices shown on the platform are inclusive or exclusive of delivery charges as
                                displayed during checkout.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping & Delivery</h2>
                            <p>
                                Delivery timelines are estimated and may vary depending on location, courier partner, or
                                unforeseen circumstances. SellNow is not responsible for delays caused by third-party logistics
                                providers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cancellation & Returns</h2>
                            <p>
                                Order cancellation and return eligibility depend on the seller’s return policy and product category.
                                Once an order is shipped, cancellation may not be possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Refund Policy</h2>
                            <p>
                                Refunds, if applicable, will be processed after successful return verification and may take several
                                business days to reflect in the customer’s account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. User Responsibilities</h2>
                            <p>
                                Customers are responsible for providing correct delivery details. SellNow is not liable for failed
                                deliveries due to incorrect address or unavailability of the customer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
                            <p>
                                SellNow shall not be liable for indirect losses, delays, or damages arising from seller actions,
                                courier delays, or external factors beyond platform control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Policy Updates</h2>
                            <p>
                                SellNow reserves the right to update this policy at any time. Continued use of the platform
                                constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact & Support</h2>
                            <p>
                                For any queries, complaints, or support requests, customers may contact SellNow through official
                                support channels available on the platform.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
