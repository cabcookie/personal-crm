import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Sparkles } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type ProjectSummaryProps = {
  summary?: string;
  updatedAt?: Date;
  className?: string;
};

// Collapsed height ≈ 4 lines at text-sm / leading-relaxed (1.625 * 0.875rem).
const COLLAPSED_MAX_HEIGHT_PX = 88; // ~5.5rem

/**
 * Subtle, AI-generated project summary shown under the project title on the
 * detail page. The summary is Markdown prose (five bold-lead paragraphs) and
 * is regenerated automatically a few minutes after notes change; it is not
 * user-editable.
 *
 * Collapsed by default to ~4 lines with a fade overlay and a "More…" toggle;
 * expands to the content's full height on click and collapses again with
 * "Show less". The toggle/overlay only appear when the content actually
 * exceeds the collapsed height, so short summaries render plainly.
 */
const ProjectSummary: FC<ProjectSummaryProps> = ({
  summary,
  updatedAt,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure the content's natural height (scrollHeight is unaffected by the
  // collapsed max-height clamp). We compare against a fixed pixel threshold
  // rather than clientHeight so the measurement stays stable when expanded.
  // Re-measures on text change and on resize (reflow/width changes).
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [summary]);

  if (!summary?.trim()) return null;

  const overflows = contentHeight > COLLAPSED_MAX_HEIGHT_PX + 1;
  const showToggle = overflows;

  return (
    <div
      className={cn(
        "mx-1 md:mx-2 rounded-md border border-border/60 bg-muted/40 px-3 py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground pb-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Summary</span>
        {updatedAt && (
          <span className="font-normal">
            · updated {formatDistanceToNow(updatedAt, { addSuffix: true })}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          ref={contentRef}
          className="text-sm text-muted-foreground leading-relaxed space-y-2 overflow-hidden transition-[max-height] duration-300 ease-in-out [&_strong]:text-foreground/80 [&_strong]:font-semibold"
          style={{
            // When expanded, grow to the measured full height (no clipping,
            // any length). When collapsed, clamp to ~4 lines. If it doesn't
            // overflow, leave it unclamped.
            maxHeight: expanded
              ? contentHeight
              : overflows
                ? COLLAPSED_MAX_HEIGHT_PX
                : undefined,
          }}
        >
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>

        {/* Fade overlay at the bottom while collapsed. */}
        {!expanded && overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted/40 to-transparent" />
        )}
      </div>

      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : "More…"}
        </button>
      )}
    </div>
  );
};

export default ProjectSummary;
