import { Fragment } from "react";

/**
 * Renders copy with "|" line markers. On desktop each part is its own line,
 * matching the mockup; on small screens the text flows naturally.
 */
export function Lines({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span className="ln">{part}</span>
          {i < parts.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

export const plain = (text: string) => text.replaceAll("|", " ");
