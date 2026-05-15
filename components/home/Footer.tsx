import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Footer() {
  return (
    <footer className="bg-[#FAF6F0] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 border-t border-[#EADFD6] pt-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2
            className={`${cinzel.className} mb-3 text-2xl font-semibold tracking-[0.03em] text-[#315F5B]`}
          >
            Whisk & Wonder
          </h2>

          <p className="max-w-md text-sm leading-7 text-[#7D6E66]">
            Elegant seaside afternoon tea experience inspired by Pink Beach
            Lombok.
          </p>
        </div>

        <div>
          <h3
            className={`${cinzel.className} mb-3 text-[11px] uppercase tracking-[0.3em] text-[#C8A86A]`}
          >
            Visit
          </h3>

          <p className="text-sm leading-7 text-[#7D6E66]">
            Jalan Pantai Pink No. 18
            <br />
            Lombok Timur, Indonesia
          </p>
        </div>

        <div>
          <h3
            className={`${cinzel.className} mb-3 text-[11px] uppercase tracking-[0.3em] text-[#C8A86A]`}
          >
            Contact
          </h3>

          <p className="text-sm leading-7 text-[#7D6E66]">
            Daily • 11:00 – 20:00
            <br />
            hello@whiskandwonder.com
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 text-xs text-[#B3A39A] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Whisk & Wonder.</p>

        <p className={`${cinzel.className} tracking-[0.06em]`}>
          Luxury Afternoon Tea Reservation System
        </p>
      </div>
    </footer>
  );
}
