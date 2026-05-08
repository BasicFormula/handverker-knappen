import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { mode, Mode } from "app";

interface Props {
  children: React.ReactNode;
  label: string;
  initialX?: number;
  initialY?: number;
  onClose?: () => void;
}

export default function PositionHelper({ 
  children, 
  label, 
  initialX = 0, 
  initialY = 0,
  onClose 
}: Props) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Only show in dev mode
  if (mode !== Mode.DEV) {
    return <>{children}</>;
  }

  const copyToClipboard = () => {
    const code = `transform: translate(${x}px, ${y}px)`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        style={{
          transform: `translate(${x}px, ${y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>

      {/* Control Panel - Fixed position */}
      <Card className="fixed bottom-4 left-4 p-3 bg-black/90 backdrop-blur-sm shadow-2xl border border-amber-600 z-[9999] w-64">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-amber-600 text-xs">{label}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setCollapsed(!collapsed)}>
              <span className="text-white text-xs">{collapsed ? '▼' : '▲'}</span>
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
                <X className="w-3 h-3 text-white" />
              </Button>
            )}
          </div>
        </div>

        {!collapsed && (
          <div className="space-y-2">
            {/* X Position */}
            <div>
              <Label className="text-xs font-semibold mb-1 block text-white">
                X: {x}px
              </Label>
              <Slider
                value={[x]}
                onValueChange={([value]) => setX(value)}
                min={-1000}
                max={1000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Y Position */}
            <div>
              <Label className="text-xs font-semibold mb-1 block text-white">
                Y: {y}px
              </Label>
              <Slider
                value={[y]}
                onValueChange={([value]) => setY(value)}
                min={-1000}
                max={1000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setX(initialX);
                setY(initialY);
              }}
              className="w-full h-7 text-xs"
            >
              Reset
            </Button>

            {/* Copy CSS */}
            <div className="bg-amber-600/10 p-2 rounded">
              <code className="text-[10px] block mb-1 text-amber-400 font-mono">
                translate({x}px, {y}px)
              </code>
              <Button
                variant="default"
                size="sm"
                onClick={copyToClipboard}
                className="w-full h-7 text-xs bg-amber-600 hover:bg-amber-700"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
