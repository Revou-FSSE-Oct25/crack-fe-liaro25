import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
          Elegant Afternoon Tea Experience
        </p>

        <h1 className="text-6xl font-bold mb-6">Whisk & Wonder</h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
          Reserve your perfect afternoon tea experience with elegant desserts,
          premium teas, and a cozy atmosphere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reservation"
            className="bg-black text-white px-8 py-4 rounded-xl"
          >
            Make Reservation
          </Link>

          <Link
            href="/reservation/check"
            className="border border-black px-8 py-4 rounded-xl"
          >
            Check Reservation
          </Link>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Reservation Information
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">Opening Hours</h3>

              <p className="text-gray-600">11:00 AM — 8:00 PM</p>
            </div>

            <div className="bg-background p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">
                Reservation Duration
              </h3>

              <p className="text-gray-600">120 minutes per reservation</p>
            </div>

            <div className="bg-background p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">Latest Reservation</h3>

              <p className="text-gray-600">Last booking at 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
