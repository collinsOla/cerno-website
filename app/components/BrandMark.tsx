/* The Cerno mark: a serif C encircled by a twelve-point constellation ring
   (dots joined by faint lines), which rotates slowly. Reused in the header,
   footer, and the placeholder pages. */

const N = 12;
const R = 44; // ring radius within the 100x100 viewBox
const points = Array.from({ length: N }, (_, i) => {
  const a = ((-90 + i * (360 / N)) * Math.PI) / 180;
  return [50 + R * Math.cos(a), 50 + R * Math.sin(a)] as const;
});
const ringPath =
  "M " +
  points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ") +
  " Z";

export default function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg className="brand-ring" viewBox="0 0 100 100">
        <path className="brand-ring-line" d={ringPath} fill="none" />
        {points.map(([x, y], i) => (
          <circle className="brand-ring-node" key={i} cx={x} cy={y} r={2.4} />
        ))}
      </svg>
      <span className="brand-c">C</span>
    </span>
  );
}
