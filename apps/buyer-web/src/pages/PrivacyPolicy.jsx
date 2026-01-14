import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                        Privacy Policy for SellNow
                    </h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                Welcome to SellNow. We value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, share, and protect your data when you use our online marketplace platform.
                                <br /><br />
                                This policy is published in compliance with:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>The Information Technology Act, 2000</li>
                                    <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
                                    <li>The Consumer Protection (E-Commerce) Rules, 2020</li>
                                </ul>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                            <p>To provide our services, we collect the following types of information:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Personal Information:</strong> When you create an account, we collect the information you provide to ensure it is accurate. This may include your name, email address, and phone number.</li>
                                <li><strong>Delivery Information:</strong> We collect your shipping address and contact details to facilitate product delivery. You are responsible for providing correct delivery details.</li>
                                <li><strong>Order & Payment Information:</strong> We process details regarding your orders and payment confirmation to fulfill your purchases.</li>
                                <li><strong>Transaction History:</strong> We maintain records of your orders, cancellations, and return requests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Purpose of Collection</h2>
                            <p>We use your information for the following purposes:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Order Fulfillment:</strong> To process orders, confirm payments, and manage product availability.</li>
                                <li><strong>Shipping & Delivery:</strong> To coordinate with courier partners and ensure your products reach the specified location.</li>
                                <li><strong>Refunds & Returns:</strong> To verify return eligibility and process refunds to your account where applicable.</li>
                                <li><strong>Customer Support:</strong> To address queries, complaints, or support requests submitted through our official channels.</li>
                                <li><strong>Platform Integrity:</strong> To prevent misuse, fraudulent activity, or violations of platform rules.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing and Disclosure</h2>
                            <p>We may share your information with third parties only as described below:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Sellers:</strong> Relevant customer information (such as order details and delivery address) is shared with registered sellers on the platform to fulfill your purchase.</li>
                                <li><strong>Logistics Providers:</strong> We share delivery details with third-party logistics providers to facilitate shipping. Please note that delivery timelines are estimated and subject to these third parties.</li>
                                <li><strong>Legal Compliance:</strong> We may disclose information if required by law, court order, or government authority.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
                            <p>
                                We implement reasonable security practices and procedures to protect your data from unauthorized access, misuse, or disclosure. However, please note that no method of transmission over the internet is completely secure. We are not liable for indirect losses or damages arising from external factors beyond our control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. User Rights</h2>
                            <p>In accordance with Indian laws, you have the right to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Access and Correct:</strong> You may access and update your account information to ensure it is accurate.</li>
                                <li><strong>Withdraw Consent:</strong> You may withdraw your consent for data processing by contacting us, subject to the condition that we may likely be unable to provide services thereafter.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Grievance Officer (Mandatory)</h2>
                            <p>
                                In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the Grievance Officer are provided below:
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p><strong>Name:</strong> Compliance Officer</p>
                                <p><strong>Designation:</strong> Grievance Officer</p>
                                <p><strong>Email:</strong> sellnowhyd@gmail.com</p>
                                <p><strong>Address:</strong> Ameenpur, Hyderabad, Telangana, India</p>
                                <p><strong>Phone:</strong> +91 90140 81760</p>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                The Grievance Officer will acknowledge your complaint within 48 hours and resolve it within 1 month.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Policy Updates</h2>
                            <p>
                                SellNow reserves the right to update this policy at any time. Continued use of the platform constitutes your acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
                            <p>
                                For any queries regarding this Privacy Policy or other support requests, please contact us through the official support channels available on the platform.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
