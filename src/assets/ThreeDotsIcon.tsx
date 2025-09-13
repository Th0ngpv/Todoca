export default function ThreeDotsIcon({ size = 18, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="4" cy="10" r="2" fill={color} />
      <circle cx="10" cy="10" r="2" fill={color} />
      <circle cx="16" cy="10" r="2" fill={color} />
    </svg>
  );
}