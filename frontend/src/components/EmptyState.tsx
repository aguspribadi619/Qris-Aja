import React from "react";
import { Text, View } from "react-native";
import { C, styles } from "@/src/theme";
import { Badge } from "@/src/components/Icon";

export function EmptyState({ icon, title, sub }: any) {
  return <View style={styles.empty}><Badge icon={icon} color={C.muted} tint="#EEF0F7" /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptySub}>{sub}</Text></View>;
}
