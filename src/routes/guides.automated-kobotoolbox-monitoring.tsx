import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://enumerator-monitoring-dashboard.lovable.app/guides/automated-kobotoolbox-monitoring";
const TITLE = "Automating KoboToolbox Data Quality Monitoring";
const DESC = "A practical guide to replacing manual Excel exports with real-time dashboards that automatically score KoboToolbox submissions for accuracy.";

export const Route = createFileRoute("/guides/automated-kobotoolbox-monitoring")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Enumerator Field Monitoring` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          mainEntityOfPage: URL,
          about: ["KoboToolbox data quality", "mobile data collection accuracy", "automate KoboToolbox reporting"],
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 prose prose-slate dark:prose-invert">
      <nav className="text-sm mb-6">
        <Link to="/" className="text-primary hover:underline">← Back to dashboard</Link>
      </nav>

      <h1>{TITLE}</h1>
      <p className="lead">{DESC}</p>

      <h2>Why manual KoboToolbox exports break at scale</h2>
      <p>
        Most M&amp;E teams start the same way: enumerators submit forms through KoboToolbox,
        a supervisor downloads an Excel export at the end of the week, sorts by date, and
        starts hunting for duplicates, missing GPS points, and suspiciously fast interviews.
        It works for a pilot. It collapses the moment you have ten enumerators and a deadline.
      </p>
      <p>
        The problem isn't Kobo — it's the loop. By the time errors surface in a spreadsheet,
        the enumerator is in a different village, the respondent is unreachable, and the
        fieldwork budget is already spent. Automating <strong>KoboToolbox data quality</strong>
        checks closes that loop from days to minutes.
      </p>

      <h2>The four checks every automated pipeline should run</h2>
      <ol>
        <li>
          <strong>Duplicate detection</strong> — flag submissions sharing the same household ID,
          phone number, or GPS point within a tight radius. Manual sorting misses near-duplicates;
          a script catches them on submission.
        </li>
        <li>
          <strong>Interview duration</strong> — compare <code>start</code> and <code>end</code>
          timestamps against a realistic floor (e.g. 8 minutes for a 40-question survey). Anything
          shorter is a strong signal of enumerator shortcuts.
        </li>
        <li>
          <strong>GPS plausibility</strong> — reject points outside the assigned enumeration area
          or with accuracy worse than 50m. Pair with a live map so supervisors can spot clusters
          that drift from the sampling frame.
        </li>
        <li>
          <strong>Completeness &amp; consistency</strong> — required-field coverage, skip-logic
          violations, and cross-question contradictions (age 12 + married + employed).
        </li>
      </ol>

      <h2>From Excel macros to a real-time dashboard</h2>
      <p>
        The transition is less about new tools and more about moving the checks <em>upstream</em>.
        Instead of an analyst running a macro on Monday morning, the Kobo API is polled every
        minute, each new submission is scored against the four checks above, and the result
        lands on a dashboard the field coordinator already has open.
      </p>
      <p>
        That is exactly what this project does. The dashboard you see at <Link to="/">the home
        page</Link> pulls submissions from KoboToolbox on a 60-second interval, runs the scoring
        engine server-side, and surfaces per-enumerator quality scores, GPS maps, and duration
        outliers without anyone exporting a file.
      </p>

      <h2>A reference architecture for mobile data collection accuracy</h2>
      <ul>
        <li><strong>Source</strong>: KoboToolbox <code>/api/v2/assets/&lt;form&gt;/data</code> endpoint, authenticated with a server-only token.</li>
        <li><strong>Scheduler</strong>: a server function (or pg_cron) that fetches new submissions on a fixed interval.</li>
        <li><strong>Scoring engine</strong>: pure functions that take a submission and return per-check pass/fail plus a 0–100 score.</li>
        <li><strong>Storage</strong>: persist scored submissions so trends survive page reloads and you can audit historical quality.</li>
        <li><strong>Surface</strong>: a live dashboard with per-enumerator leaderboards, GPS map, duration histogram, and alert thresholds.</li>
      </ul>

      <h2>How to automate KoboToolbox reporting without rebuilding everything</h2>
      <p>
        You do not need to replace KoboToolbox — it remains the system of record for forms and
        submissions. What you replace is the <em>reporting layer</em>: the weekly Excel pivot
        becomes a continuously updated view. Three practical moves get most teams there:
      </p>
      <ol>
        <li>Generate a long-lived API token in your Kobo account and store it server-side only.</li>
        <li>Write the four checks as small, testable functions — start with duplicates and duration; they catch the majority of issues.</li>
        <li>Render the output on a dashboard the field team already trusts, with one alert channel (email or Slack) for critical failures.</li>
      </ol>

      <h2>What to measure once it's live</h2>
      <p>
        Track <strong>median time-to-detection</strong> (submission → flag), <strong>per-enumerator
        quality score</strong> over the rolling 7 days, and <strong>flag resolution rate</strong>.
        Those three numbers tell you whether automation is actually improving fieldwork or just
        producing prettier reports.
      </p>

      <p className="text-sm text-muted-foreground">
        Want to see this in action? <Link to="/">Open the live monitoring dashboard</Link> to see
        scored KoboToolbox submissions update in real time.
      </p>
    </article>
  );
}