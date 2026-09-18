"use client";

import { Browser } from "@capacitor/browser";
import { FormEvent, useMemo, useState } from "react";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  image?: string;
};

const demoResults: SearchResult[] = [
  {
    title: "TideSearch",
    url: "https://tidesearch.example/",
    snippet: "Fast, clean search results rendered directly inside TideSearch.",
    image: "https://picsum.photos/seed/tidesearch/720/420",
  },
  {
    title: "A useful page result",
    url: "https://example.com/",
    snippet: "Page cards can include a thumbnail, source, title and a short description.",
    image: "https://picsum.photos/seed/pagecard/720/420",
  },
  {
    title: "Another web result",
    url: "https://www.iana.org/help/example-domains",
    snippet: "Normal results stay lightweight with a favicon, title, URL and snippet.",
  },
];

function host(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [tab, setTab] = useState<"all" | "images">("all");

  const results = useMemo(() => searched ? demoResults : [], [searched]);

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearched(q);
    setTab("all");
  }

  async function openResult(url: string) {
    await Browser.open({ url, presentationStyle: "fullscreen" });
  }

  return (
    <main className="shell">
      <header className={searched ? "hero heroCompact" : "hero"}>
        <button className="brand" onClick={() => { setQuery(""); setSearched(""); }} aria-label="TideSearch home">
          <span className="waveMark" aria-hidden="true">≈</span><span>TideSearch</span>
        </button>
        {!searched && <p className="tagline">Search the web.</p>}
        <form className="searchForm" onSubmit={runSearch}>
          <span className="searchIcon" aria-hidden="true">⌕</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the web" aria-label="Search the web" autoComplete="off" spellCheck={false}/>
          {query && <button className="clearButton" type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          <button className="searchButton" type="submit" disabled={!query.trim()}>Search</button>
        </form>
      </header>

      {searched ? (
        <section className="resultsWrap">
          <nav className="searchTabs" aria-label="Search result type">
            <button className={tab === "all" ? "tab activeTab" : "tab"} onClick={() => setTab("all")}>All</button>
            <button className={tab === "images" ? "tab activeTab" : "tab"} onClick={() => setTab("images")}>Images</button>
          </nav>
          <div className="resultMeta">Native TideSearch preview for “{searched}”</div>

          {tab === "images" ? (
            <div className="imageGrid">
              {results.filter(r => r.image).map((r) => (
                <button className="imageCard" key={r.url} onClick={() => openResult(r.url)}>
                  <img src={r.image} alt="" />
                  <span>{r.title}</span><small>{host(r.url)}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="resultsList">
              <div className="photoStrip">
                <div className="sectionTitle">Images</div>
                <div className="photoRow">
                  {results.filter(r => r.image).map(r => <img key={r.url} src={r.image} alt="" />)}
                </div>
              </div>
              {results.map((r, i) => (
                <button className={i < 2 ? "result pageCard" : "result"} key={r.url} onClick={() => openResult(r.url)}>
                  {r.image && <img className="cardThumb" src={r.image} alt="" />}
                  <div className="resultBody">
                    <div className="sourceLine"><span className="favicon">{host(r.url).slice(0,1).toUpperCase()}</span><span>{host(r.url)}</span></div>
                    <h2>{r.title}</h2><p>{r.snippet}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="notice">This build proves the TideSearch-owned results UI. It does not scrape Google. A supported search-data backend plugs into these cards next.</div>
        </section>
      ) : (
        <footer className="homeFooter"><span>TideSearch native results prototype</span><span>No search webpage loaded</span></footer>
      )}
    </main>
  );
}
