import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Transaction, styles } from "@/src/theme";
import { Icon } from "@/src/components/Icon";
import { Header } from "@/src/components/Header";
import { TransactionRow } from "@/src/components/TransactionRow";
import { EmptyState } from "@/src/components/EmptyState";

export function History({ onBack, filter, setFilter, onExport, transactions }: any) {
  const [dateFilter, setDateFilter] = useState("Minggu ini");
  const inDate = (t: Transaction) => dateFilter === "Bulan ini" ? true : dateFilter === "Minggu ini" ? (t.time.startsWith("Hari ini") || t.time.startsWith("Kemarin")) : t.time.startsWith("Hari ini");
  const visible = transactions.filter((t) => (filter === "Semua" || t.status === filter) && inDate(t));
  return <View style={styles.flex}><Header title="Riwayat transaksi" onBack={onBack} right={<Pressable testID="export-history" onPress={onExport} style={styles.iconButton}><Icon name="download-outline" color="#fff" /></Pressable>} /><ScrollView contentContainerStyle={styles.page}><Text style={styles.pageIntro}>Pantau semua pembayaran toko dengan mudah.</Text><Pressable testID="export-csv" onPress={onExport} style={({ pressed }) => [styles.exportBtn, pressed && styles.pressed]}><Icon name="download-outline" color="#0F806B" size={17} /><Text style={styles.exportBtnText}>Ekspor CSV</Text></Pressable><Text style={styles.filterLabel}>Periode</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateChips}>{["Hari ini", "Minggu ini", "Bulan ini"].map((d) => <Pressable testID={`date-${d}`} key={d} onPress={() => setDateFilter(d)} style={[styles.dateChip, dateFilter === d && styles.chipActive]}><Text style={[styles.chipText, dateFilter === d && styles.chipTextActive]}>{d}</Text></Pressable>)}</ScrollView><Text style={styles.filterLabel}>Status</Text><View style={styles.chips}>{["Semua", "Berhasil", "Menunggu"].map((f) => <Pressable testID={`filter-${f}`} onPress={() => setFilter(f)} key={f} style={[styles.chip, filter === f && styles.chipActive]}><Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text></Pressable>)}</View>{visible.length ? visible.map((t) => <TransactionRow item={t} key={t.id} />) : <EmptyState icon="receipt-outline" title="Belum ada transaksi" sub="Transaksi dengan status ini akan muncul di sini." />}</ScrollView></View>;
}
