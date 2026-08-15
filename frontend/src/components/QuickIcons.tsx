import React from "react";
import Svg, { Rect, Circle, Path, Text as SvgText } from "react-native-svg";

type Props = { size?: number };

// Flat, multi-color illustration icons (competitor-style) for quick actions.

function Analisa({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="7" y="38" width="34" height="3" rx="1.5" fill="#DCE3F2" />
      <Rect x="9" y="28" width="7" height="11" rx="2.5" fill="#34D9BB" />
      <Rect x="20" y="20" width="7" height="19" rx="2.5" fill="#17C3A2" />
      <Rect x="31" y="12" width="7" height="27" rx="2.5" fill="#F2A93C" />
      <Path d="M11 24 L23 16 L35 8" stroke="#0E9E84" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="35" cy="8" r="2.6" fill="#0E9E84" />
    </Svg>
  );
}

function Pegawai({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="33" cy="16" r="6" fill="#7C6AE8" />
      <Rect x="25" y="26" width="18" height="15" rx="9" fill="#7C6AE8" />
      <Circle cx="18" cy="18" r="7.5" fill="#4657B8" />
      <Rect x="5" y="29" width="26" height="16" rx="11" fill="#4657B8" />
      <Circle cx="15" cy="16" r="2.4" fill="#ffffff" opacity="0.35" />
    </Svg>
  );
}

function Laporan({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="9" y="6" width="26" height="36" rx="5" fill="#2E6BE6" />
      <Path d="M31 6 L35 6 L35 10 Z" fill="#7FB0FF" />
      <Rect x="14" y="15" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.92" />
      <Rect x="14" y="22" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.65" />
      <Rect x="14" y="29" width="10" height="3" rx="1.5" fill="#ffffff" opacity="0.65" />
      <Circle cx="33" cy="34" r="8" fill="#17C3A2" />
      <Path d="M29.5 34 L32 36.5 L36.5 31.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function Outlet({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="10" y="22" width="28" height="20" rx="3" fill="#16204A" />
      <Rect x="7" y="13" width="6.8" height="10" fill="#17C3A2" />
      <Rect x="13.8" y="13" width="6.8" height="10" fill="#F2A93C" />
      <Rect x="20.6" y="13" width="6.8" height="10" fill="#17C3A2" />
      <Rect x="27.4" y="13" width="6.8" height="10" fill="#F2A93C" />
      <Rect x="34.2" y="13" width="6.8" height="10" fill="#17C3A2" />
      <Rect x="6" y="11" width="36" height="4" rx="2" fill="#0F1A3D" />
      <Rect x="20" y="30" width="8" height="12" rx="1.5" fill="#34D9BB" />
      <Circle cx="26" cy="36" r="0.9" fill="#16204A" />
    </Svg>
  );
}

function Notifikasi({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="22" y="4" width="4" height="6" rx="2" fill="#E0932F" />
      <Path d="M24 7 C15 7 15 16 15 24 C15 29 12 31 11 34 L37 34 C36 31 33 29 33 24 C33 16 33 7 24 7 Z" fill="#FBBF24" />
      <Path d="M20 34 a4 4 0 0 0 8 0 Z" fill="#E0932F" />
      <Path d="M18 14 C18 11 21 9 24 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.55" fill="none" />
      <Circle cx="35" cy="11" r="5.5" fill="#ffffff" />
      <Circle cx="35" cy="11" r="4" fill="#E8564C" />
    </Svg>
  );
}

function Bantuan({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="38" cy="11" r="5" fill="#7C6AE8" />
      <Path d="M9 9 h26 a6 6 0 0 1 6 6 v11 a6 6 0 0 1 -6 6 h-14 l-8 6 v-6 a6 6 0 0 1 -4 -6 v-11 a6 6 0 0 1 6 -6 Z" fill="#17C3A2" />
      <SvgText x="22" y="27" fontSize="18" fontWeight="bold" fill="#ffffff" textAnchor="middle">?</SvgText>
    </Svg>
  );
}

const MAP: Record<string, React.FC<Props>> = {
  analisa: Analisa,
  pegawai: Pegawai,
  laporan: Laporan,
  outlet: Outlet,
  notifikasi: Notifikasi,
  bantuan: Bantuan,
};

export function QuickArt({ name, size = 44 }: { name: string; size?: number }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp size={size} />;
}
