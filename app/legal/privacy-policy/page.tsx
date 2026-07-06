import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
                <p className="text-xs text-gray-400 mb-6">Last updated: July 2026</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                    <section>
                        <h2 className="text-base font-bold mb-2">1. Introduction</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Bethora (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates bethora.com.ng, an online store selling women&apos;s fashion,
                            men&apos;s fashion, children&apos;s wear, shoes, and jewelry to customers across Nigeria. This Privacy
                            Policy explains what information we collect when you use our platform, how we use it, and the choices
                            you have. By creating an account or placing an order with us, you agree to the practices described here.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">2. Information We Collect</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            When you create an account, place an order, or browse our store, we may collect your name, email
                            address, phone number, and delivery address. We also collect information about how you use our
                            platform — such as the products you view, items you add to your cart, and pages you visit — through
                            cookies and similar tracking technologies. This browsing activity helps us understand what our
                            customers are interested in and improve the shopping experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">3. How We Use Your Information</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We use the information we collect to process and fulfil your orders, arrange delivery, manage your
                            account, and communicate with you about your purchases. We also use browsing and activity data to
                            personalise product recommendations, understand shopping trends, and improve our website. We do not
                            sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">4. Third-Party Services</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Bethora is built on Firebase, a platform provided by Google, which we use for account authentication,
                            secure storage of your order and account data, and hosting of product images. Firebase processes data
                            on our behalf under Google&apos;s own privacy and security practices. We only share the information
                            necessary for Firebase to provide these services and do not permit it to be used for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">5. Cookies Policy</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We use cookies to keep you signed in, remember items in your cart, and track recently viewed products
                            so we can show you relevant recommendations. A session cookie is also used to distinguish your visit
                            from others for activity tracking purposes. You can disable cookies in your browser settings, though
                            some features of the site — such as staying logged in or keeping items in your cart — may not work
                            properly without them. See our{" "}
                            <Link href="/legal/cookie-policy" className="text-primary-600 font-medium hover:underline">
                                Cookie Policy
                            </Link>{" "}
                            for full details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">6. Your Rights</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            You have the right to access, correct, or request deletion of the personal information we hold about
                            you. You can update your name, phone number, and saved addresses at any time from your account
                            dashboard. To request a copy of your data or ask us to delete your account, please contact us using
                            the details below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">7. Data Security</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We take reasonable technical and organisational measures to protect your personal information from
                            unauthorised access, loss, or misuse. Passwords are never stored in plain text, and access to customer
                            data within our systems is restricted to authorised personnel only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">8. Changes to This Policy</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal
                            reasons. Any changes will be posted on this page with a new &quot;Last updated&quot; date. We encourage you to
                            review this page periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">9. Contact Us</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            If you have any questions about this Privacy Policy or how we handle your information, please contact
                            us at{" "}
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
