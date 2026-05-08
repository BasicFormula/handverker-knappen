import { useNavigate } from "react-router-dom";

// Helper function to calculate dodecagon points in percentages
const getDodecagonPointsPercent = () => {
  const cx = 50;
  const cy = 50;
  const r = 50;
  const points = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI / 6) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
};

export function HexagonalButton() {
  const navigate = useNavigate();
  
  const points = getDodecagonPointsPercent();
  const clipPath = points.map(p => `${p.x}% ${p.y}%`).join(', ');

  const lines = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      lines.push({ p1: points[i], p2: points[j] });
    }
  }

  return (
    <div className="my-12 flex justify-center w-full px-4">
      <button
        onClick={() => navigate("/service-request-page")}
        className="relative bg-gradient-to-br from-amber-600 via-copper-600 to-amber-700
                   text-white font-bold text-xl sm:text-2xl uppercase tracking-wider
                   transition-all duration-300 ease-in-out
                   hover:scale-105 active:scale-95
                   shadow-[0_12px_32px_rgba(217,119,6,0.5)]
                   hover:shadow-[0_16px_48px_rgba(217,119,6,0.7)]
                   w-full max-w-[360px] aspect-square
                   border-2 border-amber-500/30"
        style={{
          clipPath: `polygon(${clipPath})`,
        }}
      >
        <div className="absolute inset-0 z-0">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.15">
              {lines.map((line, index) => (
                <line
                  key={index}
                  x1={line.p1.x}
                  y1={line.p1.y}
                  x2={line.p2.x}
                  y2={line.p2.y}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Metallic highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent z-5" />

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span style={{ textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(255,255,255,0.3)" }}>
            Start Oppdrag
          </span>
        </div>
      </button>
    </div>
  );
}
