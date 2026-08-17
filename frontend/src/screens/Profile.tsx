import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C, styles } from "@/src/theme";
import { QuickArt } from "@/src/components/QuickIcons";
import { Icon } from "@/src/components/Icon";
import { Header } from "@/src/components/Header";

export function Profile({ onBack, onEmployees, onNotifications, notifCount, onSoundSettings }: any) {
  const menus = [{ art: "pegawai", label: "Kelola pegawai", sub: "2 pegawai aktif", press: onEmployees }, { art: "outlet", label: "Outlet saya", sub: "3 outlet terhubung" }, { art: "notifikasi", label: "Notifikasi", sub: "Atur suara & preferensi", press: onNotifications, badge: notifCount }, { art: "suara", label: "Suara pembayaran", sub: "Intro custom & suara nominal", press: onSoundSettings }];
  return <View style={styles.flex}><Header title="Profil" onBack={onBack} right={<Pressable style={styles.iconButton}><Icon name="settings-outline" color="#fff" /></Pressable>} /><ScrollView contentContainerStyle={styles.page}><View style={styles.profileCard}><LinearGradient colors={[C.navy, C.purple]} style={styles.avatar}><Text style={styles.avatarText}>AP</Text></LinearGradient><View><Text style={styles.profileName}>Agus Pribadi</Text><Text style={styles.profileSub}>KSM Management</Text><View style={styles.verified}><Icon name="checkmark-circle" color={C.teal} size={14} /><Text style={styles.verifiedText}>Terverifikasi</Text></View></View><Icon name="chevron-forward" color={C.muted} size={20} /></View><Text style={styles.sectionTitle}>Pengaturan merchant</Text><View style={styles.menuCard}>{menus.map((m) => <Pressable testID={`menu-${m.label}`} onPress={m.press} key={m.label} style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}><QuickArt name={m.art} size={40} /><View style={styles.transactionMain}><Text style={styles.menuLabel}>{m.label}</Text><Text style={styles.muted}>{m.sub}</Text></View><Icon name="chevron-forward" color={C.muted} size={18} /></Pressable>)}</View><Pressable testID="logout-button" onPress={() => Alert.alert("Keluar dari akun?", "Anda dapat masuk kembali kapan saja.")} style={styles.logout}><Icon name="log-out-outline" color={C.red} size={20} /><Text style={styles.logoutText}>Keluar</Text></Pressable></ScrollView></View>;
}
