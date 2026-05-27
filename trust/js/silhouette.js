// Generates an SVG silhouette for each character.
// Each shape is a soft abstract form — no faces, just presence.
// The shape hints at personality: Sam is a warm full circle, Marcus is angular,
// Maya is symmetrical, Theo has a closed edge, Naomi flows, Ren is complex.

const SHAPES = {
  sam: `<circle cx="50" cy="50" r="40" />`,

  marcus: `<polygon points="50,10 88,72 12,72" />`,

  maya: `<ellipse cx="50" cy="50" rx="38" ry="38" />
         <ellipse cx="50" cy="50" rx="22" ry="22" opacity="0.35" />`,

  theo: `<path d="M50,12 L88,68 Q50,88 12,68 Z" />`,

  naomi: `<ellipse cx="50" cy="50" rx="28" ry="40" />`,

  ren: `<polygon points="50,14 72,28 82,54 66,76 34,76 18,54 28,28" />`,
};

export function buildSilhouette(charId, color, size = 100) {
  const shape = SHAPES[charId] ?? SHAPES.sam;
  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${size}" height="${size}" viewBox="0 0 100 100"
    class="char-silhouette" aria-hidden="true">
    <g fill="${color}" opacity="0.9">${shape}</g>
  </svg>`;
}
