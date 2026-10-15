import { redirect } from "next/navigation";

// "/" opens Home page 1 (also redirected in next.config.ts).
export default function Index() {
  redirect("/home-page-1");
}
