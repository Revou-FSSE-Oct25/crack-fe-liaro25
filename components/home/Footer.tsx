import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Footer() {
  return (
    <footer className="bg-[#FAF6F0] px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2
            className={`${cinzel.className} mb-5 text-4xl font-semibold tracking-[0.03em] text-[#315F5B]`}
          >
            Whisk & Wonder
          </h2>

          <p className="max-w-md text-lg leading-9 text-[#7D6E66]">
            An elegant seaside afternoon tea café inspired by Pink Beach Lombok.
          </p>
        </div>

        <div>
          <h3
            className={`${cinzel.className} mb-5 text-sm uppercase tracking-[0.35em] text-[#C8A86A]`}
          >
            Visit
          </h3>

          <p className="text-lg leading-9 text-[#7D6E66]">
            Whisk & Wonder Tea House
            <br />
            Jalan Pantai Pink No. 18
            <br />
            Sekaroh, Lombok Timur
            <br />
            West Nusa Tenggara, Indonesia
          </p>
        </div>

        <div>
          <h3
            className={`${cinzel.className} mb-5 text-sm uppercase tracking-[0.35em] text-[#C8A86A]`}
          >
            Contact
          </h3>

          <p className="text-lg leading-9 text-[#7D6E66]">
            Daily • 11:00 AM – 08:00 PM
            <br />
            reservations@whiskandwonder.com
            <br />
            +62 812-3456-7890
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 text-sm text-[#B3A39A] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Whisk & Wonder. All rights reserved.</p>

        <p className={`${cinzel.className} tracking-[0.08em]`}>
          Luxury Afternoon Tea Reservation System
        </p>
      </div>
    </footer>
  );
}
