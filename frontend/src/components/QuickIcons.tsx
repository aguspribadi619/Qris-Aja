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

function Pengaturan({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="8" y="15.5" width="32" height="3.4" rx="1.7" fill="#C9E9E2" />
      <Rect x="8" y="29.1" width="32" height="3.4" rx="1.7" fill="#DDD6F7" />
      <Circle cx="18" cy="17.2" r="5.6" fill="#17C3A2" />
      <Circle cx="18" cy="17.2" r="2.1" fill="#ffffff" opacity="0.9" />
      <Circle cx="31" cy="30.8" r="5.6" fill="#7C6AE8" />
      <Circle cx="31" cy="30.8" r="2.1" fill="#ffffff" opacity="0.9" />
    </Svg>
  );
}

function Wallet({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="20" y="9" width="16" height="9" rx="2" fill="#17C3A2" />
      <Rect x="8" y="13" width="32" height="24" rx="5" fill="#F2A93C" />
      <Rect x="8" y="13" width="32" height="7" rx="5" fill="#E0932F" />
      <Rect x="28" y="22" width="12" height="8" rx="3" fill="#16204A" />
      <Circle cx="33" cy="26" r="1.9" fill="#F2A93C" />
    </Svg>
  );
}

function Trophy({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M15 9 h18 v7 a9 9 0 0 1 -18 0 Z" fill="#F2A93C" />
      <Path d="M15 11 h-3 a4 4 0 0 0 0 8 h1" fill="none" stroke="#E0932F" strokeWidth="2.4" />
      <Path d="M33 11 h3 a4 4 0 0 1 0 8 h-1" fill="none" stroke="#E0932F" strokeWidth="2.4" />
      <Rect x="22" y="24" width="4" height="6" fill="#E0932F" />
      <Rect x="16" y="30" width="16" height="4" rx="1.5" fill="#16204A" />
      <Rect x="19" y="34" width="10" height="3.5" rx="1.5" fill="#16204A" />
      <Path d="M24 12 l1.3 2.6 2.9 .4 -2.1 2 .5 2.9 -2.6 -1.4 -2.6 1.4 .5 -2.9 -2.1 -2 2.9 -.4 Z" fill="#ffffff" opacity="0.9" />
    </Svg>
  );
}

function Transaksi({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M17 33 V15" stroke="#17C3A2" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M11.5 20.5 L17 15 L22.5 20.5" stroke="#17C3A2" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M31 15 V33" stroke="#F2A93C" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M25.5 27.5 L31 33 L36.5 27.5" stroke="#F2A93C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function Qris({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="11" y="11" width="10" height="10" rx="2.5" fill="#16204A" />
      <Rect x="14.5" y="14.5" width="3" height="3" rx="0.5" fill="#ffffff" />
      <Rect x="27" y="11" width="10" height="10" rx="2.5" fill="#16204A" />
      <Rect x="30.5" y="14.5" width="3" height="3" rx="0.5" fill="#ffffff" />
      <Rect x="11" y="27" width="10" height="10" rx="2.5" fill="#16204A" />
      <Rect x="14.5" y="30.5" width="3" height="3" rx="0.5" fill="#ffffff" />
      <Rect x="27" y="27" width="4" height="4" rx="1" fill="#17C3A2" />
      <Rect x="33" y="27" width="4" height="4" rx="1" fill="#17C3A2" />
      <Rect x="27" y="33" width="4" height="4" rx="1" fill="#17C3A2" />
      <Rect x="33" y="33" width="4" height="4" rx="1" fill="#17C3A2" />
    </Svg>
  );
}

function Cash({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="7" y="14" width="34" height="20" rx="4" fill="#17C3A2" />
      <Circle cx="24" cy="24" r="6.5" fill="#E6FAF5" />
      <SvgText x="24" y="27.4" fontSize="8" fontWeight="bold" fill="#0F806B" textAnchor="middle">Rp</SvgText>
      <Circle cx="12" cy="19" r="1.8" fill="#ffffff" opacity="0.7" />
      <Circle cx="36" cy="29" r="1.8" fill="#ffffff" opacity="0.7" />
    </Svg>
  );
}

function Sukses({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="15" fill="#17C3A2" />
      <Path d="M16.5 24.5 L21.5 29.5 L31.5 19" stroke="#ffffff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="19" cy="18" r="2.4" fill="#ffffff" opacity="0.3" />
    </Svg>
  );
}

function Tips({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M9 12 l2.4 2.4 M39 12 l-2.4 2.4 M24 5 v3" stroke="#F2A93C" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="24" cy="20" r="10" fill="#FBBF24" />
      <Rect x="20" y="27" width="8" height="5" rx="1.5" fill="#E0932F" />
      <Rect x="21" y="32" width="6" height="3.2" rx="1.5" fill="#16204A" />
      <Path d="M24 15 v6 M21 22.5 h6" stroke="#ffffff" strokeWidth="1.8" opacity="0.85" strokeLinecap="round" />
    </Svg>
  );
}

function Suara({ size = 44 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M9 20 h6 l7 -6 v20 l-7 -6 h-6 Z" fill="#16204A" />
      <Path d="M27 18 a8 8 0 0 1 0 12" stroke="#17C3A2" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <Path d="M31 13 a14 14 0 0 1 0 22" stroke="#F2A93C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
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
  pengaturan: Pengaturan,
  wallet: Wallet,
  trophy: Trophy,
  transaksi: Transaksi,
  qris: Qris,
  cash: Cash,
  sukses: Sukses,
  tips: Tips,
  suara: Suara,
};

export function QuickArt({ name, size = 44 }: { name: string; size?: number }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp size={size} />;
}
