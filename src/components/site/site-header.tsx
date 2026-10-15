"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { IconArrow, IconClose, IconMenu, Wordmark } from "./brand";
import { NAV } from "./content";

/** Final site header. Sits on the hero photo at the top of the homepage, solid once scrolled. */
export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = `nav${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const onVariations = pathname.startsWith("/variations");

  return (
    <header
      className="sh"
      data-over={overHero && !scrolled && !open ? "" : undefined}
      data-scrolled={scrolled ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <div className="sh__inner">
        <Link href="/" className="sh__brand" aria-label="Cape Gutters, home" onClick={close}>
          <Wordmark className="sh__logo" />
        </Link>

        <nav className="sh__nav" aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="sh__link">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/variations"
                className="sh__link sh__link--tab"
                aria-current={onVariations ? "page" : undefined}
              >
                Variations
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="sh__toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open && <div className="sh__backdrop" onClick={close} aria-hidden="true" />}
      <div id={menuId} ref={panelRef} className="sh__panel" hidden={!open}>
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={close}>
                {n.label}
                <IconArrow />
              </a>
            </li>
          ))}
          <li>
            <Link href="/variations" onClick={close} aria-current={onVariations ? "page" : undefined}>
              Variations
              <IconArrow />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
