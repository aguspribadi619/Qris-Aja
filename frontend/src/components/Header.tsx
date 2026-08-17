import React from "react";
import { Pressable, Text, View } from "react-native";
import { C, styles } from "@/src/theme";
import { Icon } from "@/src/components/Icon";

export function Header({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  return <View style={styles.simpleHeader}>{onBack ? <Pressable testID="back-button" onPress={onBack} style={styles.iconButton}><Icon name="arrow-back" color="#fff" /></Pressable> : <View style={styles.brandMark}><Icon name="qr-code" color={C.teal} size={18} /></View>}<Text style={styles.headerTitle}>{title || "QRIS Aja"}</Text><View style={styles.headerRight}>{right}</View></View>;
}
