import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ReservationCTA() {
  return (
    <section
      id="reservation"
      className="relative flex h-[calc(100vh-96px)]  items-center overflow-hidden bg-[#315F5B] px-6 sm:px-10 lg:px-16"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#8FBFBE] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#E8B7C8] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p
          className={`${cinzel.className} mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
        >
          Reserve Your Experience
        </p>

        <h2
          className={`${cinzel.className} mb-8 text-3xl font-semibold leading-tight tracking-[0.04em] text-white sm:text-4xl lg:text-5xl`}
        >
          Plan your next afternoon tea by the sea.
        </h2>

        <p className="mx-auto mb-10 max-w-2xl leading-8 text-white/80">
          Create memorable moments with elegant tea sets, refined pastries, and
          a serene ocean-inspired atmosphere.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/reservation"
            className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#315F5B] shadow-xl transition hover:-translate-y-1 hover:scale-105"
          >
            Reserve Your Table
          </Link>

          <Link
            href="/reservation/check"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Check Reservation
          </Link>
        </div>
      </div>
    </section>
  );
}
