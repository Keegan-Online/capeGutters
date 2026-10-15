import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = { title: "Cape Gutters | Home page 1" };

export default function HomePageOne() {
  return <HomePage variant="one" />;
}
