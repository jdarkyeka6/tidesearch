import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Enter a search query." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_WSS_API_KEY;
  const clientId = process.env.GOOGLE_WSS_CLIENT_ID;

  if (!apiKey || !clientId) {
    return NextResponse.json(
      {
        error:
          "TideSearch is ready, but Google Web Search Service credentials have not been added yet.",
        setupRequired: true,
      },
      { status: 503 },
    );
  }

  const params = new URLSearchParams({
    "searchQuery.query": query,
    "searchQuery.languageCode": "en",
    "searchQuery.restrictRegionCode": "AU",
    "searchQuery.safeSearch": "ON",
    "clientContext.clientId": clientId,
    "userContext.ipAddress": getClientIp(request),
    "userContext.regionCode": "AU",
    pageSize: "10",
  });

  try {
    const googleResponse = await fetch(
      `https://websearchservice.googleapis.com/v1:search?${params.toString()}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
        },
        cache: "no-store",
      },
    );

    const googleData = await googleResponse.json();

    if (!googleResponse.ok) {
      const googleMessage =
        googleData?.error?.message || "Google Search returned an error.";
      return NextResponse.json({ error: googleMessage }, { status: googleResponse.status });
    }

    const results = (googleData.searchResults || []).map(
      (item: {
        title?: string;
        displayUrl?: string;
        shortenedDisplayUrl?: string;
        snippet?: string;
      }) => ({
        title: item.title || "Untitled result",
        url: item.displayUrl || "#",
        displayUrl: item.shortenedDisplayUrl || item.displayUrl || "",
        snippet: item.snippet || "",
      }),
    );

    return NextResponse.json({
      results,
      totalResults: googleData.searchInfo?.formattedTotalResults,
      searchDuration: googleData.searchInfo?.searchDuration,
      correctedQuery: googleData.searchInfo?.correctedQuery,
      nextPageToken: googleData.nextPageToken,
    });
  } catch {
    return NextResponse.json(
      { error: "TideSearch could not reach Google Search." },
      { status: 502 },
    );
  }
}
