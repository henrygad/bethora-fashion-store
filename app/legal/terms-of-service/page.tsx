import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Terms of Service</h1>
                <p className="text-xs text-gray-400 mb-6">Last updated: July 2026</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                    <section>
                        <h2 className="text-base font-bold mb-2">1. Acceptance of Terms</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            By accessing or using bethora.com.ng (&quot;the Platform&quot;), you agree to be bound by these Terms of
                            Service. If you do not agree with any part of these terms, please do not use the Platform. We may
                            update these terms from time to time, and continued use of the Platform after changes are posted
                            constitutes acceptance of the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">2. Use of the Platform</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            You agree to use Bethora only for lawful purposes and in a manner that does not infringe the rights
                            of, or restrict or inhibit the use and enjoyment of, this site by any third party. You are
                            responsible for maintaining the confidentiality of your account login details and for all activity
                            that occurs under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">3. Product Listings &amp; Pricing</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            All prices on Bethora are listed in Nigerian Naira (₦) and are subject to change without prior
                            notice. We make every effort to display accurate product information, including images, sizing, and
                            pricing, but we do not warrant that product descriptions or other content on the Platform are
                            error-free. In the event of a pricing error, we reserve the right to cancel any order placed at the
                            incorrect price and will notify you if this occurs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">4. Order Placement &amp; Cancellation</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            When you place an order, you will receive an order confirmation, which is an acknowledgement that we
                            have received your order and does not guarantee acceptance. Orders may be cancelled or amended
                            before they are shipped by contacting our support team. Once an order has been dispatched for
                            delivery, it can no longer be cancelled and must instead follow our returns process.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">5. Delivery Terms</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We deliver to Lagos and nationwide across Nigeria. Standard delivery typically takes 3–5 business
                            days from the date your order is confirmed, though delivery times may vary depending on your
                            location and other circumstances beyond our control. Delivery fees, where applicable, are calculated
                            at checkout based on your order value and location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">6. Returns &amp; Refunds</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We accept returns within 7 days of delivery for items that are unworn, unused, and in their original
                            condition with tags attached. Certain items, such as jewelry, underwear, and sale items, are not
                            eligible for return. Full details of our returns process, including how to initiate a return and our
                            refund timeline, are available on our{" "}
                            <Link href="/legal/return-policy" className="text-primary-600 font-medium hover:underline">
                                Return Policy
                            </Link>{" "}
                            page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">7. Intellectual Property</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            All content on the Platform, including the Bethora name, logo, product photography, graphics, and
                            page layouts, is the property of Bethora or its licensors and is protected by applicable
                            intellectual property laws. You may not reproduce, distribute, or otherwise use any content from the
                            Platform without our prior written consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">8. Limitation of Liability</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Bethora shall not be liable for any indirect, incidental, or consequential damages arising from your
                            use of the Platform or purchase of our products, to the fullest extent permitted by law. Our total
                            liability for any claim relating to an order shall not exceed the amount you paid for that order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">9. Governing Law</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            These Terms of Service are governed by and construed in accordance with the laws of the Federal
                            Republic of Nigeria. Any disputes arising from these terms or your use of the Platform shall be
                            subject to the exclusive jurisdiction of the courts of Nigeria.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">10. Contact Us</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at{" "}
                            <a href="mailto:support@bethora.com.ng" className="text-primary-600 font-medium hover:underline">
                                support@bethora.com.ng
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
