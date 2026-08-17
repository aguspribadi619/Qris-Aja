import React from "react";
import { Text, View } from "react-native";
import { C, styles } from "@/src/theme";
import { Icon } from "@/src/components/Icon";

export function Toast({ text }: any) {
  if (!text) return null;
  return <View pointerEvents="none" style={styles.toast}><Icon name="checkmark-circle" color={C.teal} size={18} /><Text style={styles.toastText}>{text}</Text></View>;
}
