import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C, styles } from "@/src/theme";

export function Icon({ name, color = C.navy, size = 20 }: { name: keyof typeof Ionicons.glyphMap; color?: string; size?: number }) {
  return <Ionicons name={name} color={color} size={size} />;
}
export function Badge({ icon, color = C.teal, tint = "rgba(23,195,162,.13)" }: { icon: keyof typeof Ionicons.glyphMap; color?: string; tint?: string }) {
  return <View style={[styles.badge, { backgroundColor: tint, shadowColor: color }]}><View style={[styles.badgeInner, { backgroundColor: color }]}><Icon name={icon} color="#fff" size={18} /></View><View style={[styles.badgeSpark, { backgroundColor: color }]} /></View>;
}
