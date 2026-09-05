"use client";

import { FormEvent, useMemo, useState } from "react";

type SearchResult = {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
};

type SearchPayload = {
  results?: SearchResult[];
  totalResults?: string;
  searchDuration?: string;
  correctedQuery?: string;
  error?: string;
  setupRequired?: boolean;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [meta, setMeta] = useState<{ totalResults?: string; searchDuration?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasSearched = searchedQuery.length > 0;

  const metaLine = useMemo(() => {
    if (!hasSearched || loading || message) return "";
    const bits: string[] = [];
    if (meta.totalResults) bits.push(`${meta.totalResults} results`);
    if (meta.searchDuration) bits.push(meta.searchDuration);
    return bits.join(" · ");
  }, [hasSearched, loading, message, meta]);

  async function runSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearchedQuery(q);
    setLoading(true);
    setMessage("");
    setResults([]);
    setMeta({});

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const data: SearchPayload = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed.");
      }

      setResults(data.results || []);
      setMeta({
        totalResults: data.totalResults,
        searchDuration: data.searchDuration,
      });

      if (data.correctedQuery && data.correctedQuery !== q) {
        setMessage(`Showing results for “${data.correctedQuery}”`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={hasSearched ? "shell shellResults" : "shell"}>
      <header className={hasSearched ? "hero heroCompact" : "hero"}>
        <button
          className="brand"
          onClick={() => {
            setQuery("");
            setSearchedQuery("");
            setResults([]);
            setMessage("");
            setMeta({});
          }}
          aria-label="TideSearch home"
        >
          <span className="waveMark" aria-hidden="true">≈</span>
          <span>TideSearch</span>
        </button>

        {!hasSearched && (
          <p className="tagline">The web, without the clutter.</p>
        )}

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
          <button className="searchButton" type="submit" disabled={loading || !query.trim()}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
      </header>

      {hasSearched && (
        <section className="resultsWrap" aria-live="polite">
          <div className="resultMeta">
            <span>{loading ? `Searching for “${searchedQuery}”` : metaLine}</span>
          </div>

          {message && <div className="notice">{message}</div>}

          {!loading && !message && results.length === 0 && (
            <div className="emptyState">
              <h2>No results surfaced.</h2>
              <p>Try a broader search.</p>
            </div>
          )}

          <div className="resultsList">
            {results.map((result, index) => (
              <article className="result" key={`${result.url}-${index}`}>
                <a href={result.url} target="_blank" rel="noreferrer" className="resultLink">
                  <div className="resultUrl">{result.displayUrl}</div>
                  <h2>{result.title}</h2>
                </a>
                {result.snippet && <p>{result.snippet}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {!hasSearched && (
        <footer className="homeFooter">
          <span>TideSearch v0.1</span>
          <span>Powered by Google search infrastructure</span>
        </footer>
      )}
    </main>
  );
}
