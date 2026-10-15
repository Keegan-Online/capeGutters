"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Arrow, Logo } from "./icons";
import { NAV, VERSIONS, type Variant } from "./content";

/** `linkBase` lets a specimen (style guide) point section links at a real page. */
export function SiteHeader({ variant, linkBase = "" }: { variant: Variant; linkBase?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = `menu${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    const onResize = () => window.innerWidth >= 1360 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  const versions = (
    <ul className="versions" aria-label="Homepage versions">
      {VERSIONS.map((v) => {
        const active = v.variant === variant;
        return (
          <li key={v.href}>
            <Link href={v.href} className="versions__link" aria-current={active ? "page" : undefined} onClick={close}>
              {v.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <header className="site-header" data-scrolled={scrolled ? "" : undefined} data-open={open ? "" : undefined}>
      <div className="site-header__inner">
        <a
          href={`${linkBase}#top`}
          className="site-header__brand"
          aria-label="Cape Gutters, back to top"
          onClick={close}
        >
          <Logo />
        </a>

        <nav className="site-header__nav" aria-label="Main">
          <ul className="nav">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={`${linkBase}${n.href}`} className="nav__link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          {versions}
        </nav>

        <a href={`${linkBase}#quote`} className="btn btn--header">
          <span>Request a quote</span>
          {variant === "one" && <Arrow className="btn__arrow" />}
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-toggle__label">{open ? "Close" : "Menu"}</span>
          <span className="menu-toggle__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {open && <div className="menu-backdrop" onClick={close} aria-hidden="true" />}
      <div id={menuId} ref={panelRef} className="mobile-menu" hidden={!open}>
        <ul className="mobile-menu__nav">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={`${linkBase}${n.href}`} onClick={close}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__versions">
          <p className="mobile-menu__caption">Switch version</p>
          {versions}
        </div>
        <a href={`${linkBase}#quote`} className="btn btn--block" onClick={close}>
          <span>Request a quote</span>
          <Arrow className="btn__arrow" />
        </a>
      </div>
    </header>
  );
}
