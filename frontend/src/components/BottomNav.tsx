import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, Tab, styles } from "@/src/theme";
import { Icon } from "@/src/components/Icon";

export function BottomNav({ tab, onTab, onQris }: { tab: Tab; onTab: (t: Tab) => void; onQris: () => void }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.bottom, { height: 76 + insets.bottom, paddingBottom: insets.bottom }]}><NavItem icon="home-outline" color="#16A889" active={tab === "beranda"} label="Beranda" onPress={() => onTab("beranda")} /><NavItem icon="time-outline" color="#5D6BC7" active={tab === "riwayat"} label="Riwayat" onPress={() => onTab("riwayat")} /><Pressable testID="qris-fab" onPress={onQris} style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}><Icon name="qr-code" color={C.navy} size={24} /><Text style={styles.fabLabel}>QRIS</Text></Pressable><NavItem icon="bar-chart-outline" color="#C47B13" active={tab === "analisa"} label="Analisa" onPress={() => onTab("analisa")} /><NavItem icon="person-outline" color="#D2566A" active={tab === "profil"} label="Profil" onPress={() => onTab("profil")} /></View>;
}
function NavItem({ icon, color, active, label, onPress }: any) {
  return <Pressable testID={`nav-${label}`} onPress={onPress} style={styles.navItem}><Icon name={icon} color={active ? color : "#A2ABC1"} size={22} /><Text style={[styles.navLabel, active && { color }]}>{label}</Text></Pressable>;
}
