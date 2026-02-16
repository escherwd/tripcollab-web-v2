"use server";

import Link from "next/link";

export default async function WelcomePage() {
  return (
    <>
      <style>{"#mobile-overlay { display: none }"}</style>
      <div className="pt-12 pb-24 px-4">
        <div className="w-full aspect-[3.6] rounded-lg overflow-hidden mx-auto max-w-3xl">
          <img
            src="/images/tripcollab-banner.webp"
            alt="Banner Image"
            className="object-fill"
          />
        </div>
        <main className="mx-auto max-w-xl">
          <h1 className="mt-12 font-display text-xl font-medium">
            Introduction
          </h1>
          <p className="mt-3 text-gray-700">
            <span className="italic">
              Tripcollab: Developing a Collaborative Spatial and Temporal
              Platform for Visualizing Complex Travel Itineraries
            </span>
            <br />
            <br />
            This thesis explores how the integration of interactive map-based
            spatial visualizations and schedule-based temporal visualizations
            can improve the user experience of collaborative trip planning
            through iterative design and user testing. The goal of this project
            is to develop an online platform for visualizing complex travel
            itineraries, with a focus on user-friendliness and accessibility.
          </p>
          <h1 className="mt-12 font-display text-xl font-medium">
            Beta Testing
          </h1>
          <p className="mt-3 text-gray-700">
            The platform is currently in a closed beta. Are you a tester?{" "}
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
