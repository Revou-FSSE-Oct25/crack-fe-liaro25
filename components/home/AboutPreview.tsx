import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AboutPreview() {
  return (
    <section
      id="about"
      className="flex min-h-[calc(100vh-96px)]  items-center bg-[#FAF6F0] px-6 py-12 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-4xl shadow-2xl shadow-pink-100/30 lg:max-h-140">
          <Image
            src="/images/about-preview.webp"
            alt="Whisk & Wonder Interior"
            width={900}
            height={1200}
            className="h-full w-full object-contain object-top"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
        </div>

        <div>
          <p
            className={`${cinzel.className} mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#8FBFBE]`}
          >
            About Whisk & Wonder
          </p>

          <h2
            className={`${cinzel.className} mb-6 text-3xl font-semibold leading-tight tracking-[0.04em] text-[#315F5B] sm:text-4xl lg:text-5xl`}
          >
            A luxury afternoon tea escape inspired by Lombok.
          </h2>

          <p className="mb-5 leading-7 text-text-primary/75">
            Whisk & Wonder brings together the elegance of European afternoon
            tea culture with the warmth of Nusantara hospitality.
          </p>

          <p className="mb-8 leading-7 text-text-primary/75">
            Inspired by Pink Beach Lombok, our café was created as a calm
            seaside destination for meaningful conversations, premium tea
            experiences, and beautifully curated pastries.
          </p>

          <Link
            href="/reservation"
            className="inline-flex rounded-full bg-[#315F5B] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-teal-900/20 transition hover:-translate-y-1 hover:scale-105"
          >
            Reserve Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
