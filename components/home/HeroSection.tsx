import Image from "next/image";
import Link from "next/link";
import { Cinzel, Great_Vibes } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-background"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/menu/western-afternoon-tea.webp"
          alt="Whisk & Wonder afternoon tea by the sea"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-background/92 via-background/58 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background/58 via-transparent to-white/20" />

      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center px-6 py-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <div className="mb-5 w-64 max-w-full sm:w-80 lg:w-104">
            <Image
              src="/images/logo.png"
              alt="Whisk & Wonder logo"
              width={700}
              height={420}
              priority
              className="h-auto w-full drop-shadow-[0_18px_35px_rgba(49,95,91,0.18)]"
            />
          </div>

          <h1
            className={`${cinzel.className} mb-4 max-w-3xl text-3xl font-semibold uppercase leading-[1.05] tracking-[0.06em] text-teal-dark sm:text-2xl lg:text-4xl`}
          >
            <span className="block">Luxury Seaside</span>
            <span className="block">Afternoon Tea</span>
          </h1>

          <p
            className={`${greatVibes.className} mb-4 text-2xl leading-none text-blush drop-shadow-sm sm:text-3xl lg:text-5xl`}
          >
            presented with warmth and wonder
          </p>

          <p className="mb-6 max-w-lg text-sm leading-6 text-teal-dark/80 sm:text-base sm:leading-7">
            Where Western elegance meets Nusantara warmth in a pastel ocean-view
            café.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reservation"
              className="rounded-full bg-blush px-7 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-pink-200/40 transition hover:-translate-y-1 hover:scale-105"
            >
              Reserve Your Table
            </Link>

            <Link
              href="/#menu"
              className="rounded-full border border-gold bg-white/70 px-7 py-3 text-center text-sm font-semibold text-teal-dark shadow-lg shadow-amber-100/30 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/90"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden max-w-70 rounded-4xl border border-white/45 bg-white/35 p-5 text-teal-dark shadow-2xl shadow-teal-900/10 backdrop-blur-md lg:block">
        <p
          className={`${cinzel.className} mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold`}
        >
          Visit Us
        </p>

        <div className="space-y-3 text-sm leading-6">
          <div>
            <p className="font-semibold">Opening Hours</p>
            <p className="text-teal-dark/75">Everyday, 11:00 AM – 08:00 PM</p>
          </div>

          <div className="h-px bg-white/60" />

          <div>
            <p className="font-semibold">Inspired by</p>
            <p className="text-teal-dark/75">Pink Beach Lombok</p>
          </div>
        </div>
      </div>
    </section>
  );
}
