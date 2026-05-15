import Image from "next/image";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const galleryImages = [
  {
    src: "/images/menu/western-savory-platter.webp",
    title: "Savory Selection",
  },
  {
    src: "/images/menu/western-sweet-platter.webp",
    title: "Sweet Patisserie",
  },
  {
    src: "/images/menu/traditional-platter.webp",
    title: "Nusantara Bites",
  },
  {
    src: "/images/menu/western-beverage.webp",
    title: "Premium Tea",
  },
];

export default function GalleryPreview() {
  return (
    <section
      id="gallery"
      className="flex min-h-[calc(100vh-96px)] items-center bg-[#FAF6F0] px-6 py-12 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 text-center">
          <p
            className={`${cinzel.className} mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#8FBFBE]`}
          >
            Gallery
          </p>

          <h2
            className={`${cinzel.className} mx-auto mb-5 max-w-4xl text-2xl font-semibold uppercase leading-[1.2] tracking-[0.04em] text-[#315F5B] sm:text-3xl lg:text-4xl`}
          >
            A glimpse of our elegant afternoon tea moments.
          </h2>

          <p className="mx-auto max-w-2xl leading-8 text-text-primary/70">
            Soft colors, refined plating, and calm seaside inspiration come
            together in every detail.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className="group relative h-72 overflow-hidden rounded-4xl border border-white/60 shadow-xl shadow-pink-100/30 lg:h-80"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">
                <p
                  className={`${cinzel.className} text-xs uppercase tracking-[0.25em] text-white/80`}
                >
                  Whisk & Wonder
                </p>

                <h3
                  className={`${cinzel.className} mt-2 text-xl font-semibold tracking-[0.03em] text-white`}
                >
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
