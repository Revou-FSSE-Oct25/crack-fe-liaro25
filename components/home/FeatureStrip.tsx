const features = [
  {
    title: "Ocean-View Café",
    description:
      "A calming pastel seaside setting inspired by Pink Beach Lombok.",
  },
  {
    title: "Western & Nusantara Sets",
    description: "Elegant afternoon tea with refined local warmth and flavor.",
  },
  {
    title: "Online Reservation",
    description: "Book your table smoothly through our reservation system.",
  },
  {
    title: "Curated Premium Menu",
    description: "Thoughtfully selected tea, pastries, savories, and packages.",
  },
];

export default function FeatureStrip() {
  return (
    <section className="relative bg-background px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group rounded-3xl border border-border-soft bg-white/70 p-8 shadow-lg shadow-pink-100/30 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A86A]/40 bg-background text-lg font-semibold text-[#C8A86A]">
              0{index + 1}
            </div>

            <div className="mb-5 h-px w-20 bg-linear-to-r from-primary via-[#C8A86A] to-transparent" />

            <h3 className="mb-4 text-2xl font-semibold text-[#315F5B]">
              {feature.title}
            </h3>

            <p className="leading-7 text-text-primary/70">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
