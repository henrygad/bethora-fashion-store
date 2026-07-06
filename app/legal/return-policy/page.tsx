import Navbar from "@/components/shared/Navbar";

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Return &amp; Refund Policy</h1>
                <p className="text-xs text-gray-400 mb-6">Last updated: July 2026</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                    <section>
                        <h2 className="text-base font-bold mb-2">1. Overview</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We want you to love what you order from Bethora. If something isn&apos;t right, you may return
                            eligible items within 7 days of the date your order is delivered. This policy explains what can be
                            returned, how to start a return, and how refunds are processed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">2. Conditions for Return</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            To be eligible for a return, items must be unworn, unwashed, and in the same condition you received
                            them, with all original tags still attached. Items must be returned in their original packaging.
                            Products that show signs of wear, damage, or alteration will not be accepted and will be sent back
                            to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">3. Non-Returnable Items</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            For hygiene and quality reasons, certain items cannot be returned. This includes jewelry,
                            underwear and intimate apparel, and any items marked as final sale at the time of purchase. Please
                            check the product page carefully before ordering these items, as they are excluded from our
                            standard return window.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">4. How to Initiate a Return</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            To start a return, email us at{" "}
                            <a href="mailto:support@bethora.com.ng" className="text-primary-600 font-medium hover:underline">
                                support@bethora.com.ng
                            </a>{" "}
                            with your order number and the reason for your return. Our support team will review your request
                            and send you instructions on how to send the item back to us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">5. Delivery Costs for Returns</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            If your return is due to a fault on our part — such as a wrong or damaged item — we will cover the
                            cost of return delivery. If you are returning an item for any other reason, such as a change of
                            mind, the cost of returning the item to us is your responsibility.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">6. Refund Timeline</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Once we receive and inspect your returned item, we will notify you of the approval or rejection of
                            your refund. Approved refunds are processed within 5–7 business days after the item is received,
                            and will be credited back to your original payment method or bank account used for the order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">7. Exchanges</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            If you&apos;d like a different size or colour instead of a refund, let us know when you contact
                            support. Where the item you want is in stock, we will arrange for the replacement to be shipped out
                            once your returned item has been received and approved.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">8. Contact Us</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            For any questions about a return, refund, or exchange, please reach out to us at{" "}
                            <a href="mailto:support@bethora.com.ng" className="text-primary-600 font-medium hover:underline">
                                support@bethora.com.ng
                            </a>{" "}
                            and our team will be happy to help.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
