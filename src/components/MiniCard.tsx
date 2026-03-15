import React from "react";
import { useNavigate } from "react-router-dom";

interface MiniCardProps {
  title: string;
  desc: string;
  icon: any;
  to?: string;
  style?: React.CSSProperties;
}

export const MiniCard: React.FC<MiniCardProps> = ({ title, desc, icon: Icon, to, style }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => to && navigate(to)}
      style={{
        padding: "20px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        cursor: to ? "pointer" : "default",
        border: "2px solid rgba(255,255,255,0.1)",
        transition: "all 0.2s",
        ...style
      }}
    >
      <Icon size={24} style={{ marginBottom: "10px", color: "#60a5fa" }} />

      <h3 style={{ fontSize: "1rem", marginBottom: "5px" }}>
        {title}
      </h3>

      <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
        {desc}
      </p>
    </div>
  );
};