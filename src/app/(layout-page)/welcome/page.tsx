"use server";

import Link from "next/link";

export default async function WelcomePage() {
  return (
    <>
    <style>{'#mobile-overlay { display: none }'}</style>
    <div className="pt-12 pb-24 px-4">
      <div className="w-full aspect-[3.6] rounded-lg overflow-hidden mx-auto max-w-3xl">
        <img
          src="/images/tripcollab-banner.webp"
          alt="Banner Image"
          className="object-fill"
        />
      </div>
      <main className="mx-auto max-w-xl">
        <h1 className="mt-12 font-display text-xl font-medium">Introduction</h1>
        <p className="mt-3 text-gray-700">
          The purpose of this project is to develop an online platform for
          visualizing complex travel itineraries, combining spacial interfaces
          through the use of maps and temporal interfaces through the use of
          timelines and calendars. Through thoughtful experience design,
          iterative user-testing, and integrated collaboration features, the
          goal of this project is to create a user-friendly platform that
          addresses the challenges of group travel planning.
        </p>
        <h1 className="mt-12 font-display text-xl font-medium">Beta Testing</h1>
        <p className="mt-3 text-gray-700">
          This website is currently in a closed beta. Are you a tester?{" "}
          <Link className="underline" href="/login">
            Click here
          </Link>{" "}
          to log in.
        </p>
        <h1 className="mt-12 font-display text-xl font-medium">Feedback</h1>
        <p className="mt-3 text-gray-700">
          Please contact{" "}
          <a href="mailto:wrighesc@oregonstate.edu" className="underline">
            Escher
          </a>{" "}
          (wrighesc@oregonstate.edu) to provide feedback.
        </p>
      </main>
    </div>
    </>
  );
}
