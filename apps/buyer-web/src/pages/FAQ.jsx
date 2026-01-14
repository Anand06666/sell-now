import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FAQ() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

                <div className="space-y-4">
                    <FAQItem
                        question="How do I place an order?"
                        answer="Simply browse the products, add them to your cart, and proceed to checkout. You can pay securely online or choose Cash on Delivery."
                    />
                    <FAQItem
                        question="Can I cancel my order?"
                        answer="Yes, you can cancel your order before it has been shipped. Go to 'My Orders' and select 'Cancel Order'. Once shipped, orders cannot be cancelled but can be returned."
                    />
                    <FAQItem
                        question="Are the 'Refurbished' products reliable?"
                        answer="Absolutely. All refurbished products undergo strict 47-point quality checks by certified experts. They come with a warranty and are fully functional, often looking as good as new."
                    />
                    <FAQItem
                        question="How do I track my delivery?"
                        answer="Once your order is shipped, you will receive a tracking link via SMS/Email. You can also track it directly from the 'My Orders' section on our website or app."
                    />
                    <FAQItem
                        question="What if I receive a damaged product?"
                        answer="Please report any damage within 24 hours of delivery. Go to 'My Orders', select the item, and initiate a return/replacement request with photos of the damage."
                    />
                    <FAQItem
                        question="Do you offer Cash on Delivery?"
                        answer="Yes, Cash on Delivery (COD) is available for most locations and products. A small convenience fee may apply for COD orders."
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
                <span className="font-semibold text-gray-900">{question}</span>
                <span className={`text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
}
