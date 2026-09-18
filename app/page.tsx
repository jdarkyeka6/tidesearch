"use client";

import { Browser } from "@capacitor/browser";
import { useState } from "react";

const TEST_URL = "https://http.cat/418";

export default function Home() {
  const [opening, setOpening] = useState(false);

  async function openProbe() {
    setOpening(true);
    try {
      await Browser.open({
        url: TEST_URL,
        presentationStyle: "fullscreen",
      });
    } finally {
      setOpening(false);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <button className="brand" aria-label="TideSearch home">
          <span className="waveMark" aria-hidden="true">≈</span>
          <span>TideSearch</span>
        </button>

        <p className="tagline">SFSafariViewController Screen Time probe.</p>

        <div className="searchForm">
          <span className="searchIcon" aria-hidden="true">⌕</span>
          <input
            value="http.cat/418"
            aria-label="Screen Time test website"
            readOnly
          />
          <button className="searchButton" type="button" onClick={openProbe} disabled={opening}>
            {opening ? "Opening…" : "Open"}
          </button>
        </div>
      </header>

      <footer className="homeFooter">
        <span>TideSearch SafariVC Probe</span>
        <span>Clean test domain: http.cat</span>
      </footer>
    </main>
  );
}
