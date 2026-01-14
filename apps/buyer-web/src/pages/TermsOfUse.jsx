import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                        Terms of Use for SellNow
                    </h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                Welcome to SellNow. By accessing or using our platform, you agree to be bound by these Terms of Use. SellNow is an online marketplace platform that allows customers to browse, purchase, and receive products from registered sellers.
                                <br /><br />
                                These Terms constitute a legally binding agreement between you and SellNow, drafted in compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility & Account Creation</h2>
                            <p>
                                To purchase products on SellNow, you must be capable of entering into a legally binding contract under the Indian Contract Act, 1872.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Account Accuracy:</strong> You must provide accurate information while creating an account.</li>
                                <li><strong>Account Suspension:</strong> SellNow reserves the right to suspend accounts for misuse, fraudulent activity, or violation of platform rules.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Orders, Pricing & Payments</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Availability:</strong> All orders placed on SellNow are subject to product availability and successful payment confirmation.</li>
                                <li><strong>Pricing:</strong> Prices shown on the platform are inclusive or exclusive of delivery charges as displayed during checkout.</li>
                                <li><strong>Payment Confirmation:</strong> Orders are not confirmed until payment is successfully processed.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping & Delivery</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Timelines:</strong> Delivery timelines are estimated and may vary based on location, courier partner, or unforeseen circumstances.</li>
                                <li><strong>Third-Party Logistics:</strong> SellNow is not responsible for delays caused by third-party logistics providers.</li>
                                <li><strong>Customer Obligation:</strong> You are responsible for providing correct delivery details. SellNow is not liable for failed deliveries due to incorrect addresses or your unavailability.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cancellations, Returns & Refunds</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Eligibility:</strong> Order cancellation and return eligibility depend on the specific seller's return policy and the product category.</li>
                                <li><strong>Shipped Orders:</strong> Once an order is shipped, cancellation may not be possible.</li>
                                <li><strong>Refund Processing:</strong> Refunds, if applicable, will be processed only after successful return verification and may take several business days to reflect in your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
                            <p>SellNow operates as an intermediary platform. We shall not be liable for:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Indirect losses, delays, or damages arising from seller actions.</li>
                                <li>Courier delays or external factors beyond our control.</li>
                                <li>Damages resulting from unauthorized use of your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Modifications to Terms</h2>
                            <p>
                                SellNow reserves the right to update this policy at any time. Your continued use of the platform constitutes your acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Governing Law & Dispute Resolution</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Grievance Redressal</h2>
                            <p>
                                In accordance with the Consumer Protection (E-Commerce) Rules, 2020, if you have any queries, complaints, or support requests, you may contact us through the official support channels available on the platform.
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p><strong>Grievance Officer:</strong> Compliance Officer</p>
                                <p><strong>Contact:</strong> sellnowhyd@gmail.com | +91 90140 81760</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
