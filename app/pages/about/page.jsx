// pages/about.jsx
export default function About() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">About Kartenity</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          Delivering unbeatable deals, lightning-fast service, and uncompromising quality —  
          that’s the Kartenity promise.
        </p>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
          <p className="text-gray-200 leading-relaxed mb-4">
            Kartenity began with a simple vision — to make online shopping smarter, faster, and more rewarding for everyone.  
            We noticed that shoppers often had to choose between good prices, fast delivery, and product quality.  
            We decided you shouldn’t have to choose — you deserve all three.
          </p>
          <p className="text-gray-200 leading-relaxed">
            From a small team with big dreams, we’ve grown into a trusted destination for thousands of shoppers, offering curated products, unbeatable offers, and service you can count on.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
          alt="Our journey"
          className="rounded-2xl shadow-lg border border-white/20"
        />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Kartenity?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Unbeatable Deals",
                desc: "We partner directly with trusted suppliers to offer prices you won’t find anywhere else — without compromising on quality."
              },
              {
                title: "Lightning-Fast Delivery",
                desc: "With our optimized logistics network, your orders reach you faster than you expect — every time."
              },
              {
                title: "Top-Notch Quality",
                desc: "Every product undergoes a strict quality check to ensure you get only the best, every single time."
              },
              {
                title: "Customer First",
                desc: "Our customer support team is here to help you at every step, ensuring a smooth and stress-free shopping experience."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="backdrop-blur-lg bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 hover:scale-105 transition-transform"
              >
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-200">
            To create a marketplace where quality, affordability, and speed meet —  
            making shopping a delight, not a hassle.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-6 text-center">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl inline-block border border-white/20 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Join the Kartenity Experience</h2>
          <p className="text-gray-200 max-w-xl mx-auto mb-6">
            Discover why thousands trust us for their shopping needs. Shop smarter, save bigger, and enjoy better.
          </p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  );
}
