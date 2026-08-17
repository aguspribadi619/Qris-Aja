import React from "react";
import { Text, View } from "react-native";
import { Transaction, styles } from "@/src/theme";
import { Badge } from "@/src/components/Icon";

export function TransactionRow({ item }: { item: Transaction }) {
  return <View style={styles.transactionRow}><Badge icon="qr-code-outline" /><View style={styles.transactionMain}><Text style={styles.transactionOutlet} numberOfLines={1}>{item.outlet}</Text><Text style={styles.muted}>{item.time}  ·  {item.type}</Text></View><View style={styles.transactionAmount}><Text style={styles.amount}>{item.amount}</Text><Text style={[styles.status, { color: item.status === "Berhasil" ? "#0F9D82" : "#B9791A" }]}>{item.status}</Text></View></View>;
}
