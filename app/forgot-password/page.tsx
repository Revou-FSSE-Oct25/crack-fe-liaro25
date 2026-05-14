import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F1] px-6 py-20 text-center">
      <section className="mx-auto max-w-md rounded-4xl bg-white/80 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-[#315F5B]">
          Forgot Password
        </h1>

        <p className="mt-4 text-[#7D6E66]">
          Password reset feature is currently under construction.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-[#315F5B] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Login
        </Link>
      </section>
    </main>
  );
}
