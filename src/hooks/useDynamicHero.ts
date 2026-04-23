"use client";

import { usePathname } from "next/navigation";

export default function useDynamicHero() {
  const pathname = usePathname();

  const paths = [
    {
      route: "/about",
      title: "About\nUs",
      description:
        "No matter the journey, we have a boat for your story. Explore Egypt&apos;s stunning waterways with a curated selection of vessels and seasoned captains.",
      background: "/mainBg.jpg",
    },
    {
      route: "/boat-listing",
      title: "Boat\nListing",
      description:
        "No matter the journey, we have a boat for your story. Explore Egypt&apos;s stunning waterways with a curated selection of vessels and seasoned captains.",
      background: "/mainBg.jpg",
    },
    {
      route: "/boat-details",
      title: "Boat\nName",
      description:
        "No Matter The Journey, We Have A Boat For Your Story. Explore Egypt&apos;s Stunning Waterways With A Curated Selection Of Vessels And Seasoned Captains.",
      background: "/mainBg.jpg",
    },
    {
      route: "/contact",
      title: "Get in\nTouch",
      description:
        "Your Nile Journeys, All in One Place. Relive your past adventures and get ready for the ones ahead — your bookings are here, waiting to set sail",
      background: "/images/contactusheader.webp",
    },
    {
      route: "/faqs",
      title: "FAQS",
      description:
        "Set sail with Daffa and explore Egypt from a new angle — smooth waters, local stories, and moments you&apos;ll remember long after the trip ends.",
      background: "/images/Rectangle 5654.webp",
    },
    {
      route: "/our-team",
      title: "Our\nTeam",
      description:
        "Daffa is powered by a dedicated team of maritimeprofessionals, travel experts, and hospitality specialists. Ourteam combines deep local knowledge with modern booking tools to deliver seamless boat experiences.",
      background: "/images/Rectangle 56548.webp",
    },
    {
      route: "/profile",
      title: "My\nProfile",
      description:
        "No Matter The Journey, We Have A Boat For Your Story. Explore Egypt&apos;s Stunning Waterways With A Curated Selection Of Vessels And Seasoned Captains.",
      background: "/images/Rectangle 56548.webp",
    },
    {
      route: "/my-bookings",
      title: "My\nBookings",
      description:
        "Your Nile Journeys, All In One Place\nRelive Your Past Adventures And Get Ready For The Ones Ahead — Your Bookings Are Here, Waiting To Set Sail",
      background: "/mainBg.jpg",
    },
  ];

  // Find the route that matches the current pathname
  const matchedPath =
    paths.find((path) => pathname.includes(path.route)) || paths[0];

  // Split the title by \n for multi-line rendering
  const title = matchedPath.title;

  return {
    title,
    description: matchedPath.description,
    background: matchedPath.background,
  };
}
