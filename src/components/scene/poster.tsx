import type { CSSProperties } from "react";

/**
 * A still of one of the homepage's scenes, pre-rendered from the live scene by `scripts/3d/posters.mjs`. Each comes
 * in three shapes so that any screen crops it only at the sides, which is also how the live camera frames a
 * narrower window; that keeps the still and the live picture lined up when one replaces the other.
 */
const SHAPES = [
  ["tall", "(max-aspect-ratio: 3/5)"],
  ["square", "(max-aspect-ratio: 1/1)"],
  ["wide", undefined],
] as const;

export function ScenePoster({ name, className, eager, style }: { name: "vineyard" | "cellar"; className?: string; eager?: boolean; style?: CSSProperties }) {
  return (
    <picture>
      {SHAPES.flatMap(([shape, media]) =>
        ["avif", "webp"].map((type) => (
          <source key={`${shape}.${type}`} media={media} type={`image/${type}`} srcSet={`/3d/posters/${name}-${shape}.${type}`} />
        )),
      )}
      {/* Decorative: whatever shows it describes the scene itself, in words that outlive the picture. */}
      <img src={`/3d/posters/${name}-wide.webp`} alt="" fetchPriority={eager ? "high" : "low"} decoding="async" className={className} style={style} />
    </picture>
  );
}
