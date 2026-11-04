import { Fragment } from "react";

// Splits text into masked words so headings can rise word-by-word on reveal.
// `start` continues the stagger index across multiple Split runs in one heading.
export default function Split({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w"><span style={{ "--w": start + i } as React.CSSProperties}>{w}</span></span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

export const wordCount = (t: string) => t.split(" ").filter(Boolean).length;
