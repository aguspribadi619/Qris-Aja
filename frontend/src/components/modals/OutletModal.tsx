import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { C, outlets, styles } from "@/src/theme";
import { Icon } from "@/src/components/Icon";

export function OutletModal({ visible, selected, onSelect, onClose }: any) {
  return <Modal visible={visible} transparent animationType="fade"><View style={styles.modalBackdrop}><View style={styles.smallSheet}><Text style={styles.sheetTitle}>Pilih outlet</Text>{outlets.map((o) => <Pressable testID={`outlet-${o}`} key={o} onPress={() => onSelect(o)} style={styles.outletChoice}><Icon name={selected === o ? "radio-button-on" : "radio-button-off"} color={selected === o ? C.teal : C.muted} size={21} /><Text style={styles.optionTitle}>{o}</Text></Pressable>)}<Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelText}>Batal</Text></Pressable></View></View></Modal>;
}
