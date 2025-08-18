import Link from "next/link";

const pageData = {
  faq: {
    title: "Frequently Asked Questions",
    content: (
      <>
        <p className="mb-4 text-gray-300">
          We’ve answered the most common questions so you can get quick help without waiting for a response.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-blue-300">How do I track my order?</h2>
            <p className="text-gray-300">
              Once your order ships, you’ll receive a tracking link via email. You can also track it from your account’s order history page.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-300">What is your return policy?</h2>
            <p className="text-gray-300">
              Returns are accepted within <strong>14 days</strong> of delivery. Products must be unused and in their original packaging.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-300">Do you ship internationally?</h2>
            <p className="text-gray-300">
              Yes! We ship to over 50 countries worldwide. Shipping rates and delivery times vary by location.
            </p>
          </div>
        </div>
      </>
    ),
  },
  shipping: {
    title: "Shipping & Returns",
    content: (
      <>
        <p className="mb-4 text-gray-300">
          We work hard to ensure your order gets to you as quickly and safely as possible.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Orders are processed within <strong>8 hours</strong> of payment confirmation.</li>
          <li>Standard delivery times range from 3–7 business days within the country.</li>
          <li>International delivery may take 7–21 business days depending on customs clearance.</li>
          <li>Returns accepted within 14 days. Customer is responsible for return shipping unless product is defective.</li>
        </ul>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <>
        <p className="mb-4 text-gray-300">
          Your privacy matters to us. We follow strict protocols to ensure your data is safe and secure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>We never sell or share your personal information with third parties.</li>
          <li>All transactions are secured with industry-standard SSL encryption.</li>
          <li>You can request deletion of your account and data at any time.</li>
          <li>We only store the information necessary for order processing and customer support.</li>
        </ul>
      </>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    content: (
      <>
        <p className="mb-4 text-gray-300">
          By accessing and using our website, you agree to be bound by the following terms and conditions:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          <li>Products are sold as described. Please read descriptions carefully before purchase.</li>
          <li>We reserve the right to update prices, policies, and product availability without prior notice.</li>
          <li>Users must be 18 years or older or have guardian consent to place orders.</li>

        </ol>
      </>
    ),
  },
};

export default function InfoPage({ params }) {
  const page = pageData[params.slug];

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you are looking for doesn’t exist or has been moved.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 p-10 rounded-lg shadow-2xl border border-white/20">
        <h1 className="text-4xl font-extrabold mb-8 border-b border-gray-500 pb-4">{page.title}</h1>
        <div className="space-y-4">{page.content}</div>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
