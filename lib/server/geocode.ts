import "server-only";

export const COLUMBUS_CENTER = { lat: 39.9612, lng: -82.9988 };
// Bounding box that keeps geocoder results within the Columbus metro.
const COLUMBUS_BBOX = "-83.25,39.80,-82.75,40.20";

export interface GeocodeResult {
  lat: number;
  lng: number;
  matchedLabel: string;
}

/** Resolve an approximate location phrase to Columbus-area coordinates. */
export async function geocode(locationText: string): Promise<GeocodeResult | null> {
  const token = process.env.MAPBOX_SERVER_TOKEN;
  if (!token) return null;

  const query = encodeURIComponent(`${locationText}, Columbus, OH`);
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json` +
    `?access_token=${token}` +
    `&proximity=${COLUMBUS_CENTER.lng},${COLUMBUS_CENTER.lat}` +
    `&bbox=${COLUMBUS_BBOX}` +
    `&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: { center?: [number, number]; place_name?: string }[];
    };
    const f = data.features?.[0];
    if (!f?.center) return null;
    return {
      lng: f.center[0],
      lat: f.center[1],
      matchedLabel: f.place_name ?? locationText,
    };
  } catch {
    return null;
  }
}
