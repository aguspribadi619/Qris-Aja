import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "@/src/theme";

export function Toggle({ value, onValue, testID }: any) {
  return <Pressable testID={testID} onPress={() => onValue(!value)} style={[styles.toggle, value && styles.toggleOn]}><View style={[styles.toggleKnob, value && styles.toggleKnobOn]} /></Pressable>;
}
