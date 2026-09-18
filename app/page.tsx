"use client";

import { FormEvent, useState } from "react";

function destinationFor(input: string) {
  const value = input.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/.*)?$/i.test(value)) {
    return `https://${value}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}

export default function Home() {
  const [query, setQuery] = useState("");

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Screen Time probe: keep navigation in TideSearch's own Capacitor WKWebView
    // rather than handing the URL to Capacitor Browser / Safari.
    window.location.assign(destinationFor(q));
  }

  return (
    <main className="shell">
      <header className="hero">
        <button
          className="brand"
          onClick={() => setQuery("")}
          aria-label="TideSearch home"
        >
          <span className="waveMark" aria-hidden="true">≈</span>
          <span>TideSearch</span>
        </button>

        <p className="tagline">Screen Time suppression test build.</p>

        <form className="searchForm" onSubmit={runSearch}>
          <span className="searchIcon" aria-hidden="true">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Google or enter a website"
            aria-label="Search or enter website"
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <button
              className="clearButton"
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button className="searchButton" type="submit" disabled={!query.trim()}>
            Go
          </button>
        </form>
      </header>

      <footer className="homeFooter">
        <span>TideSearch Screen Time Probe</span>
        <span>Google results stay inside TideSearch</span>
      </footer>
    </main>
  );
}
