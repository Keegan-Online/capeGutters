import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/site/brand";
import { SiteFooter } from "@/components/site/sections";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = { title: "Cape Gutters | Variations" };

const ITEMS = [
  {
    href: "/variations/home-page-1",
    img: "/images/variations/home-page-1.webp",
    title: "Home page 1",
    text: "Light and open: off-white, orange and charcoal, built from the first homepage mockup.",
  },
  {
    href: "/variations/home-page-2",
    img: "/images/variations/home-page-2.webp",
    title: "Home page 2",
    text: "Warm charcoal brown with ivory and orange, built from the second homepage mockup.",
  },
];

export default function Variations() {
  return (
    <div className="site">
      <SiteHeader />
      <main className="vr">
        <div className="vr__head">
          <h1 className="vr__title">Variations</h1>
          <p className="vr__lede">
            Earlier homepage directions for Cape Gutters, kept for reference. Both are fully working pages with the same
            content, map and enquiry form.
          </p>
        </div>
        <ul className="vr__list">
          {ITEMS.map((v) => (
            <li key={v.href} className="vr__item">
              <Link href={v.href} className="vr__link">
                <span className="vr__frame">
                  <Image src={v.img} alt={`${v.title} preview`} fill sizes="(min-width: 900px) 46vw, 100vw" />
                </span>
                <span className="vr__name">
                  {v.title}
                  <IconArrow />
                </span>
                <span className="vr__text">{v.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="vr__more">
          <Link href="/variations/style-guide" className="link-s">
            Variations style guide
            <IconArrow />
          </Link>
          <Link href="/style-guide" className="link-s">
            Final site style guide
            <IconArrow />
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
