# CivicGrid MVP PRD

## Product Summary

CivicGrid is a real-time local event intelligence platform that helps residents understand what is happening around them. The MVP ingests legally available Columbus-area public safety audio, transcribes it, extracts likely events using AI, geocodes those events, and displays them on a live map with confidence indicators.

The MVP is not a scanner app. It is an event map powered by scanner-derived intelligence.

## Primary User

Curious Columbus resident.

## Core User Problem

Residents lack a reliable, real-time, easy-to-understand source for local safety and civic events.

## MVP Objective

Prove that AI can reliably convert emergency communications into structured, useful, mappable events.

## MVP Non-Goals

- Native mobile app
- User accounts
- User reports
- User confirmations
- Photos or videos
- Comments
- Social feed
- Push notifications
- Official records validation
- Neighborhood safety score
- Predictive analytics
- Historical trend analysis
- Raw scanner audio playback
- Raw transcript display

## Core User Experience

The user opens a Columbus-focused web app and sees:

- Live map
- Event pins
- Event feed
- Filters
- Event detail panel
- Confidence/source indicators

## Event Status Model

- Reported
- Corroborated
- Confirmed
- Resolved
- Unsubstantiated

## Event Object

```json
{
  "id": "evt_123",
  "title": "Possible Vehicle Collision",
  "event_type": "vehicle_accident",
  "status": "reported",
  "confidence": 0.81,
  "source_count": 1,
  "location_label": "I-71 North near 17th Ave"
}
```

## Functional Requirements

### Audio Ingestion
- Ingest Columbus-area public safety audio.
- Process audio in short chunks.
- Do not expose audio.

### Transcription
- Use local transcription.
- Store transcripts internally.
- Do not expose transcripts.

### Event Detection
- Use keyword filtering before LLM calls.
- Detect candidate events.

### AI Extraction
Extract:
- Event type
- Location
- Summary
- Urgency
- Confidence

### Geocoding
- Convert locations into coordinates.
- Support approximate locations.

### Clustering
- Merge duplicate events.
- Group updates.

### Map Display
- Show active events.
- Support filtering.

## Privacy Requirements

Do not display:
- Raw audio
- Raw transcripts
- Names
- License plates
- Medical details
- Victim information

## Cost Controls

Pipeline:

Audio
↓
Local transcription
↓
Keyword filter
↓
LLM extraction
↓
Geocoding
↓
Deduplication
↓
Map event

Rules:
- Local transcription.
- Filter before LLM.
- Cache transcript hashes.
- Summarize only candidate events.

## Latency Goal

30-60 seconds.

## Accuracy Goal

- 85%+ event classification
- 80%+ location accuracy
- Low duplicate rate

## Technical Stack

Frontend:
- Next.js
- Mapbox
- Tailwind

Backend:
- Node/Python
- Postgres/PostGIS
- Redis

AI:
- Faster Whisper
- Small LLM

Deployment:
- Vercel
- Railway/Fly.io

## Build Phases

Phase 0:
- Build ingestion pipeline.

Phase 1:
- Internal dashboard.

Phase 2:
- Private web MVP.

Phase 3:
- PWA.

Phase 4:
- Native mobile app.

## Strategic Positioning

CivicGrid is not:
- A scanner app
- A crime app
- A social network

CivicGrid is:

"Real-time intelligence for what is happening around you."

Long term:

"The intelligence layer for physical places."
