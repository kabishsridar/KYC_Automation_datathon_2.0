"use client";

import React, { useMemo } from "react";

// Basic types for graph rendering
export type IdentityNode = {
  id: string;
  label: string;
  type: "account" | "attribute";
};

export type IdentityEdge = {
  from: string;
  to: string;
};

export type IdentityGraphData = {
  nodes: IdentityNode[];
  edges: IdentityEdge[];
  connectedAccounts: string[];
  sharedPhone: boolean;
  sharedEmail: boolean;
  sharedDocument: boolean;
  sharedDevice: boolean;
  sharedIp: boolean;
  sharedAddress: boolean;
  riskScore: number; // 0–100 Identity Network Risk
};

// Mock KYC submissions with overlapping attributes
const MOCK_SUBMISSIONS = [
  {
    id: "KYC-10291",
    customer: "Rahul Sharma",
    phone: "+91-98XXX-12XXX",
    email: "rahul.sharma@example.com",
    document: "AAAA1234A",
    deviceId: "DEV-01",
    ip: "10.1.1.5",
    address: "Dindigul, TN",
  },
  {
    id: "KYC-10292",
    customer: "Sarah Williams",
    phone: "+91-97XXX-44XXX",
    email: "sarah@example.com",
    document: "BBBB5678C",
    deviceId: "DEV-02",
    ip: "10.1.1.5", // shared IP with 10291
    address: "Trichy, TN",
  },
  {
    id: "KYC-10293",
    customer: "Amit Patel",
    phone: "+91-98XXX-12XXX", // shared phone with 10291
    email: "amit.patel@example.com",
    document: "CCCC9876Z",
    deviceId: "DEV-03",
    ip: "10.2.0.9",
    address: "Ahmedabad, GJ",
  },
  {
    id: "KYC-10294",
    customer: "Meena Kumari",
    phone: "+91-90XXX-55XXX",
    email: "meena.k@example.com",
    document: "DDDD1111K",
    deviceId: "DEV-01", // shared device with 10291
    ip: "10.3.4.12",
    address: "Dindigul, TN", // shared address with 10291
  },
  {
    id: "KYC-10295",
    customer: "Michael Wilson",
    phone: "+91-99XXX-77XXX",
    email: "michael@example.com",
    document: "EEEE2222M",
    deviceId: "DEV-04",
    ip: "10.4.4.4",
    address: "Bangalore, KA",
  },
];

export function useIdentityGraph(targetId: string): IdentityGraphData {
  return useMemo(() => {
    const primary =
      MOCK_SUBMISSIONS.find((s) => s.id === targetId) ?? MOCK_SUBMISSIONS[0];

    const related = MOCK_SUBMISSIONS.filter((s) => s.id !== primary.id);

    const connectedAccounts: string[] = [];
    let sharedPhone = false;
    let sharedEmail = false;
    let sharedDocument = false;
    let sharedDevice = false;
    let sharedIp = false;
    let sharedAddress = false;

    // Build account nodes
    const nodes: IdentityNode[] = [
      {
        id: primary.id,
        label: primary.id,
        type: "account",
      },
    ];

    // Attribute nodes represent shared attributes
    const attributeNodes: Record<string, IdentityNode> = {};
    const edges: IdentityEdge[] = [];

    const addAttributeNode = (id: string, label: string) => {
      if (!attributeNodes[id]) {
        attributeNodes[id] = { id, label, type: "attribute" };
      }
    };

    const linkAccountToAttr = (accountId: string, attrId: string) => {
      edges.push({ from: accountId, to: attrId });
    };

    related.forEach((s) => {
      let connected = false;

      if (s.phone === primary.phone) {
        sharedPhone = true;
        addAttributeNode(`phone:${s.phone}`, "Phone Number");
        linkAccountToAttr(primary.id, `phone:${s.phone}`);
        linkAccountToAttr(s.id, `phone:${s.phone}`);
        connected = true;
      }
      if (s.email === primary.email) {
        sharedEmail = true;
        addAttributeNode(`email:${s.email}`, "Email Address");
        linkAccountToAttr(primary.id, `email:${s.email}`);
        linkAccountToAttr(s.id, `email:${s.email}`);
        connected = true;
      }
      if (s.document === primary.document) {
        sharedDocument = true;
        addAttributeNode(`doc:${s.document}`, "Document Number");
        linkAccountToAttr(primary.id, `doc:${s.document}`);
        linkAccountToAttr(s.id, `doc:${s.document}`);
        connected = true;
      }
      if (s.deviceId === primary.deviceId) {
        sharedDevice = true;
        addAttributeNode(`device:${s.deviceId}`, "Device ID");
        linkAccountToAttr(primary.id, `device:${s.deviceId}`);
        linkAccountToAttr(s.id, `device:${s.deviceId}`);
        connected = true;
      }
      if (s.ip === primary.ip) {
        sharedIp = true;
        addAttributeNode(`ip:${s.ip}`, "IP Address");
        linkAccountToAttr(primary.id, `ip:${s.ip}`);
        linkAccountToAttr(s.id, `ip:${s.ip}`);
        connected = true;
      }
      if (s.address === primary.address) {
        sharedAddress = true;
        addAttributeNode(`addr:${s.address}`, "Home Address");
        linkAccountToAttr(primary.id, `addr:${s.address}`);
        linkAccountToAttr(s.id, `addr:${s.address}`);
        connected = true;
      }

      if (connected) {
        connectedAccounts.push(s.id);
        nodes.push({
          id: s.id,
          label: s.id,
          type: "account",
        });
      }
    });

    const attrList = Object.values(attributeNodes);
    const allNodes = [...nodes, ...attrList];

    // Simple network risk scoring: more connections & more attribute types => higher risk
    const connectionFactor = connectedAccounts.length;
    const attrFactor =
      (sharedPhone ? 1 : 0) +
      (sharedEmail ? 1 : 0) +
      (sharedDocument ? 1 : 0) +
      (sharedDevice ? 1 : 0) +
      (sharedIp ? 1 : 0) +
      (sharedAddress ? 1 : 0);

    const rawRisk = Math.min(100, connectionFactor * 10 + attrFactor * 8);

    return {
      nodes: allNodes,
      edges,
      connectedAccounts,
      sharedPhone,
      sharedEmail,
      sharedDocument,
      sharedDevice,
      sharedIp,
      sharedAddress,
      riskScore: rawRisk,
    };
  }, [targetId]);
}

type VizProps = {
  data: IdentityGraphData;
  height?: number;
};

export const IdentityGraphVisualization: React.FC<VizProps> = ({
  data,
  height = 260,
}) => {
  if (!data.nodes.length) {
    return (
      <div className="flex items-center justify-center text-xs text-slate-500">
        No identity links detected.
      </div>
    );
  }

  // Layout: account nodes on outer ring, attribute nodes on inner ring
  const accounts = data.nodes.filter((n) => n.type === "account");
  const attrs = data.nodes.filter((n) => n.type === "attribute");

  const width = 480;
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusOuter = Math.min(width, height) / 2 - 30;
  const radiusInner = radiusOuter / 2;

  const positions: Record<string, { x: number; y: number }> = {};

  accounts.forEach((n, idx) => {
    const angle = (idx / Math.max(1, accounts.length)) * Math.PI * 2;
    positions[n.id] = {
      x: centerX + radiusOuter * Math.cos(angle),
      y: centerY + radiusOuter * Math.sin(angle),
    };
  });

  attrs.forEach((n, idx) => {
    const angle = (idx / Math.max(1, attrs.length || 1)) * Math.PI * 2;
    positions[n.id] = {
      x: centerX + radiusInner * Math.cos(angle),
      y: centerY + radiusInner * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Edges */}
      {data.edges.map((e, idx) => {
        const from = positions[e.from];
        const to = positions[e.to];
        if (!from || !to) return null;
        return (
          <line
            key={idx}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#22d3ee"
            strokeWidth={0.8}
            strokeOpacity={0.6}
          />
        );
      })}

      {/* Nodes */}
      {data.nodes.map((n) => {
        const pos = positions[n.id];
        if (!pos) return null;
        const isAccount = n.type === "account";
        return (
          <g key={n.id} transform={`translate(${pos.x},${pos.y})`}>
            <circle
              r={isAccount ? 10 : 6}
              fill={isAccount ? "#0f172a" : "#14b8a6"}
              stroke={isAccount ? "#22d3ee" : "#0f172a"}
              strokeWidth={1}
            />
            <text
              x={0}
              y={isAccount ? -14 : -10}
              textAnchor="middle"
              className="fill-slate-300"
              style={{ fontSize: "8px", fontWeight: 700 }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

type InsightsProps = {
  data: IdentityGraphData;
};

export const IdentityNetworkInsights: React.FC<InsightsProps> = ({ data }) => {
  const flags: string[] = [];
  if (data.sharedPhone) flags.push("Shared Phone Number Detected");
  if (data.sharedEmail) flags.push("Shared Email Address Detected");
  if (data.sharedDocument) flags.push("Repeated Document Usage Detected");
  if (data.sharedDevice) flags.push("Shared Device Fingerprints Detected");
  if (data.sharedIp) flags.push("Suspicious IP Reuse Detected");
  if (data.sharedAddress) flags.push("Suspicious Address Cluster Detected");

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Connected Accounts
        </span>
        <span className="text-lg font-black text-white">
          {data.connectedAccounts.length || 0}
        </span>
      </div>

      <div className="space-y-2">
        {flags.length === 0 ? (
          <div className="text-[11px] text-slate-500">
            No shared identity attributes detected in this network segment.
          </div>
        ) : (
          flags.map((f, idx) => (
            <div
              key={idx}
              className="text-[11px] font-bold text-slate-200 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              {f}
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Identity Network Risk
        </span>
        <span className="text-xl font-black text-rose-300">
          {Math.round(data.riskScore)}%
        </span>
      </div>
    </div>
  );
}

