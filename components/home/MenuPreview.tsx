import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const packages = [
  {
    name: "Western Afternoon Tea Set",
    price: "Rp380.000",
    description:
      "A refined selection of savory bites, classic scones, delicate sweets, and premium tea.",
    image: "/images/menu/western-afternoon-tea.webp",
  },
  {
    name: "Nusantara Afternoon Tea Set",
    price: "Rp380.000",
    description:
      "A warm Indonesian-inspired tea experience with traditional flavors in an elegant presentation.",
    image: "/images/menu/traditional-afternoon-tea.webp",
  },
];

export default function MenuPreview() {
  return (
    <section
      id="menu"
      className="flex min-h-[calc(100vh-96px)] items-center bg-background px-6 py-8 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-7 text-center">
          <p
            className={`${cinzel.className} mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#8FBFBE]`}
          >
            Signature Menu
          </p>

          <h2
            className={`${cinzel.className} mx-auto max-w-4xl text-2xl font-semibold uppercase leading-tight tracking-[0.04em] text-[#315F5B] lg:text-3xl`}
          >
            Curated afternoon tea sets for elegant seaside moments.
          </h2>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          {packages.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-4xl border border-border-soft bg-white/75 shadow-xl shadow-pink-100/30 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden lg:h-56">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3
                    className={`${cinzel.className} text-lg font-semibold tracking-[0.03em] text-[#315F5B] lg:text-xl`}
                  >
                    {item.name}
                  </h3>

                  <p className="text-base font-semibold text-[#C8A86A] lg:text-lg">
                    {item.price}
                  </p>
                </div>

                <p className="mb-4 text-sm leading-7 text-text-primary/70 lg:text-base">
                  {item.description}
                </p>

                <Link
                  href="/reservation"
                  className="inline-flex rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/40 transition hover:-translate-y-1 hover:scale-105"
                >
                  Reserve This Set
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
