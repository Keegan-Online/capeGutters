import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = { title: "Cape Gutters | Home page 2" };

export default function HomePageTwo() {
  return <HomePage variant="two" />;
}
