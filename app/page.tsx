"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;

    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
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

        <p className="tagline">Search the web.</p>

        <form className="searchForm" onSubmit={runSearch}>
          <span className="searchIcon" aria-hidden="true">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the web"
            aria-label="Search the web"
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
            Search
          </button>
        </form>
      </header>

      <footer className="homeFooter">
        <span>TideSearch v0.1</span>
        <span>Results provided by Google</span>
      </footer>
    </main>
  );
}
