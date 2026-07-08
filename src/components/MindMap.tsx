import { useState } from "react";
import { motion } from "motion/react";
import { MindMapNode, MindMapEdge } from "../types";

interface MindMapProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  bookTitle: string;
}

export default function MindMap({ nodes, edges, bookTitle }: MindMapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Map node type to color classes
  const getNodeStyles = (type: string, isSelected: boolean) => {
    switch (type) {
      case "core":
        return {
          bg: "bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-500",
          radius: "rx-12",
          text: "font-bold text-sm",
          scale: isSelected ? 1.15 : 1,
        };
      case "main":
        return {
          bg: "bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-md",
          radius: "rx-8",
          text: "font-semibold text-xs",
          scale: isSelected ? 1.1 : 1,
        };
      case "sub":
      default:
        return {
          bg: "bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-sm",
          radius: "rx-6",
          text: "text-[11px] font-normal",
          scale: isSelected ? 1.08 : 1,
        };
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative overflow-hidden" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-sans font-bold text-gray-800 text-sm">
            الخريطة الذهنية التفاعلية
          </h4>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            MIND MAP VISUALIZATION
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-gray-500">العنوان</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="text-gray-500">أفكار كبرى</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span>
            <span className="text-gray-500">تفاصيل</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-100/80 shadow-inner">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Edges / Connections */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={`edge-${i}`}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={fromNode.type === "core" ? "#10b981" : "#d97706"}
                strokeWidth={fromNode.type === "core" ? "0.6" : "0.4"}
                strokeDasharray={toNode.type === "sub" ? "1,1" : "none"}
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const styles = getNodeStyles(node.type, isSelected);

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
              >
                {/* Highlight Glow under core nodes */}
                {node.type === "core" && (
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="8%"
                    className="fill-emerald-100/30 animate-pulse"
                  />
                )}

                {/* Node Label/Box rendered as HTML via foreignObject for full Arabic RTL text styling support */}
                <foreignObject
                  x={`${node.x - 12}%`}
                  y={`${node.y - 5}%`}
                  width="24%"
                  height="12%"
                  className="overflow-visible"
                >
                  <motion.div
                    className={`flex items-center justify-center text-center p-2 rounded-xl border h-full transition-all duration-300 select-none ${styles.bg} ${styles.text}`}
                    style={{ scale: styles.scale }}
                    whileHover={{ scale: styles.scale * 1.05 }}
                    layout
                  >
                    <p className="line-clamp-2 leading-tight text-[10px] sm:text-xs">
                      {node.label}
                    </p>
                  </motion.div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Floating details panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-emerald-100 p-3 rounded-xl shadow-lg text-right z-10"
          >
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-full font-mono mb-1">
              {nodes.find((n) => n.id === selectedNode)?.type.toUpperCase()} NODE
            </span>
            <p className="text-xs font-semibold text-gray-800">
              {nodes.find((n) => n.id === selectedNode)?.label}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              جزء من الهيكل الفكري لكتاب "{bookTitle}". اضغط على عقدة أخرى للتصفح.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
