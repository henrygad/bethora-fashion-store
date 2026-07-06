import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Cookie Policy</h1>
                <p className="text-xs text-gray-400 mb-6">Last updated: July 2026</p>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                    <section>
                        <h2 className="text-base font-bold mb-2">1. What Are Cookies</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Cookies are small text files that are placed on your device when you visit a website. They are
                            widely used to make websites work more efficiently, keep you signed in, and provide information to
                            the site owner. This Cookie Policy explains what cookies bethora.com.ng uses and why.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">2. Types of Cookies We Use</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Essential cookies keep you signed in to your account and remember the items in your cart as you
                            browse the store — the site cannot function properly without them. Functional cookies remember
                            recently viewed products so we can show you relevant recommendations. We also use a session cookie
                            for activity tracking, which helps us understand how customers use the site so we can improve it
                            over time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">3. Third-Party Cookies</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Bethora uses Firebase, a platform provided by Google, for account authentication. Firebase may set
                            its own cookies or use similar technology to keep your login session secure. These are managed
                            under Google&apos;s own privacy and security practices and are only used to provide the
                            authentication service on our behalf.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">4. How Long We Keep Cookies</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Your session cookie is kept for up to 365 days so we can recognise repeat visits. Recently viewed
                            product cookies are kept for 30 days. Once you accept our cookie notice, we remember your choice
                            for 365 days so you are not asked again on every visit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">5. Managing Cookies</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Most web browsers let you control cookies through their settings, including blocking or deleting
                            them. Please note that if you disable cookies, some features of Bethora — such as staying logged in
                            or keeping items in your cart — may not work properly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">6. Changes to This Policy</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for
                            legal reasons. Any changes will be posted on this page with a new &quot;Last updated&quot; date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold mb-2">7. Contact Us</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            If you have any questions about this Cookie Policy, please contact us at{" "}
                            <a href="mailto:support@bethora.com.ng" className="text-primary-600 font-medium hover:underline">
                                support@bethora.com.ng
                            </a>. You can also read our{" "}
                            <Link href="/legal/privacy-policy" className="text-primary-600 font-medium hover:underline">
                                Privacy Policy
                            </Link>{" "}
                            for more on how we handle your information.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
