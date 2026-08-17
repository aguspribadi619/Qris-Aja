import React, { useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { announcePayment, previewAnnouncement, previewVoice } from "@/src/audio/paymentSound";
import { storage } from "@/src/utils/storage";
import { C, Employee, Tab, formatRp, outlets, styles, transactions } from "@/src/theme";
import { Icon } from "@/src/components/Icon";
import { BottomNav } from "@/src/components/BottomNav";
import { Toast } from "@/src/components/Toast";
import { Home } from "@/src/screens/Home";
import { History } from "@/src/screens/History";
import { Analytics } from "@/src/screens/Analytics";
import { Profile } from "@/src/screens/Profile";
import { Employees } from "@/src/screens/Employees";
import { SoundSettings } from "@/src/screens/SoundSettings";
import { QrisModal } from "@/src/components/modals/QrisModal";
import { OutletModal } from "@/src/components/modals/OutletModal";
import { NotificationModal } from "@/src/components/modals/NotificationModal";
import { EmployeeModal } from "@/src/components/modals/EmployeeModal";
import { QrisPrintModal } from "@/src/components/modals/QrisPrintModal";
import { QrisDynamicModal } from "@/src/components/modals/QrisDynamicModal";

export default function Index() {
  const [tab, setTab] = useState<Tab>("beranda");
  const [qrisModal, setQrisModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [outletModal, setOutletModal] = useState(false);
  const [employeeScreen, setEmployeeScreen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(outlets[0]);
  const [hiddenBalance, setHiddenBalance] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n1", art: "sukses", title: "Pembayaran berhasil", body: "Rp 86.000 diterima · 15.42", read: false },
    { id: "n2", art: "tips", title: "Tips operasional", body: "Jam ramai hari ini pukul 14.00–16.00", read: false },
    { id: "n3", art: "wallet", title: "Saldo dicairkan", body: "Rp 500.000 masuk ke rekening · Kemarin", read: false },
  ]);
  const [qrisPrintModal, setQrisPrintModal] = useState(false);
  const [qrisDynamicModal, setQrisDynamicModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [historyFilter, setHistoryFilter] = useState("Semua");
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "budi", name: "Budi Santoso", outlet: "Warkop Sejagat Meruyung", role: "Supervisor" },
    { id: "sari", name: "Sari Wulandari", outlet: "Warkop Sejagat Ciledug", role: "Kasir" },
  ]);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [settingsScreen, setSettingsScreen] = useState(false);
  const [voiceGender, setVoiceGender] = useState("putri");
  const [intro, setIntro] = useState<{ uri: string; name: string } | null>(null);
  const [outro, setOutro] = useState<{ uri: string; name: string } | null>(null);
  const [volume, setVolume] = useState(1);
  const [repeatTwice, setRepeatTwice] = useState(false);
  const [autoSim, setAutoSim] = useState(false);
  const [txs, setTxs] = useState(transactions);
  React.useEffect(() => { (async () => {
    const v = await storage.getItem("qa_voice", "putri");
    const iu = await storage.getItem("qa_intro_uri", "");
    const inm = await storage.getItem("qa_intro_name", "");
    const ou = await storage.getItem("qa_outro_uri", "");
    const onm = await storage.getItem("qa_outro_name", "");
    const vol = await storage.getItem("qa_volume", 1);
    const rep = await storage.getItem("qa_repeat", false);
    if (v) setVoiceGender(v);
    if (iu) setIntro({ uri: iu, name: inm || "intro" });
    if (ou) setOutro({ uri: ou, name: onm || "outro" });
    if (typeof vol === "number") setVolume(vol);
    if (typeof rep === "boolean") setRepeatTwice(rep);
  })(); }, []);

  const go = (next: Tab) => setTab(next);
  const openEmployee = (employee?: Employee) => { setEditing(employee || null); setEmployeeModal(true); };
  const openNotifications = () => setNotificationModal(true);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400); };
  const markRead = (id: string) => setNotifications((old) => old.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((old) => old.map((n) => ({ ...n, read: true })));
  const exportCsv = () => showToast(`Riwayat ${transactions.length} transaksi diekspor ke riwayat-qris.csv`);
  const removeEmployee = (id: string) => Alert.alert("Hapus pegawai?", "Data pegawai akan dihapus dari daftar.", [{ text: "Batal", style: "cancel" }, { text: "Hapus", style: "destructive", onPress: () => setEmployees((old) => old.filter((e) => e.id !== id)) }]);
  const saveVoice = (v: string) => { setVoiceGender(v); storage.setItem("qa_voice", v); };
  const saveIntro = (i: { uri: string; name: string } | null) => { setIntro(i); storage.setItem("qa_intro_uri", i ? i.uri : ""); storage.setItem("qa_intro_name", i ? i.name : ""); };
  const saveOutro = (o: { uri: string; name: string } | null) => { setOutro(o); storage.setItem("qa_outro_uri", o ? o.uri : ""); storage.setItem("qa_outro_name", o ? o.name : ""); };
  const saveVolume = (v: number) => { setVolume(v); storage.setItem("qa_volume", v); };
  const saveRepeat = (v: boolean) => { setRepeatTwice(v); storage.setItem("qa_repeat", v); };
  const openLink = (url: string) => { WebBrowser.openBrowserAsync(url).catch(() => {}); };
  const testPayment = async () => {
    const amt = [15000, 42500, 86000, 125000, 50000][Math.floor(Math.random() * 5)];
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const tx = { id: String(Date.now()), outlet: selectedOutlet === "Semua outlet" ? "Warkop Sejagat Meruyung" : selectedOutlet, time: `Hari ini, ${hh}.${mm}`, type: "QRIS Dinamis", amount: formatRp(amt), status: "Berhasil" as const };
    setTxs((old) => [tx, ...old]);
    showToast(`Pembayaran masuk ${formatRp(amt)}`);
    try { await announcePayment({ amount: amt, voiceChar: voiceGender, intro: intro ? { uri: intro.uri, max: 3000 } : null, outro: outro ? { uri: outro.uri, max: 3000 } : null, volume, repeat: repeatTwice }); } catch {}
  };
  const previewSound = async () => {
    try { await previewAnnouncement({ voiceChar: voiceGender, intro: intro ? { uri: intro.uri, max: 3000 } : null, outro: outro ? { uri: outro.uri, max: 3000 } : null, volume, repeat: repeatTwice }); } catch {}
  };
  const testVoice = async (v: string) => { try { await previewVoice(v, volume); } catch {} };
  React.useEffect(() => {
    if (!autoSim) return;
    const id = setInterval(() => { testPayment(); }, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSim, voiceGender, intro, outro, volume, repeatTwice, selectedOutlet]);

  return <SafeAreaView style={styles.safe}><View style={styles.phone}><View style={styles.statusBar}><Text style={styles.statusTime}>09:41</Text><View style={styles.statusIcons}><Icon name="cellular" color={C.navy} size={13} /><Icon name="wifi" color={C.navy} size={13} /><Icon name="battery-full" color={C.navy} size={15} /></View></View>
    {tab === "beranda" && <Home selectedOutlet={selectedOutlet} onOutlet={() => setOutletModal(true)} hiddenBalance={hiddenBalance} onHide={() => setHiddenBalance(!hiddenBalance)} onGo={go} onQris={() => setQrisModal(true)} onNotifications={openNotifications} notifCount={unreadCount} onTestPayment={testPayment} transactions={txs} onOpenLink={openLink} />}
    {tab === "riwayat" && <History onBack={() => go("beranda")} filter={historyFilter} setFilter={setHistoryFilter} onExport={exportCsv} transactions={txs} />}
    {tab === "analisa" && <Analytics onBack={() => go("beranda")} />}
    {tab === "profil" && !employeeScreen && !settingsScreen && <Profile onBack={() => go("beranda")} onEmployees={() => setEmployeeScreen(true)} onNotifications={openNotifications} notifCount={unreadCount} onSoundSettings={() => setSettingsScreen(true)} />}
    {tab === "profil" && settingsScreen && <SoundSettings onBack={() => setSettingsScreen(false)} voice={voiceGender} onVoice={saveVoice} onTestVoice={testVoice} intro={intro} onIntro={saveIntro} outro={outro} onOutro={saveOutro} onToast={showToast} onTest={testPayment} onPreview={previewSound} volume={volume} onVolume={saveVolume} repeat={repeatTwice} onRepeat={saveRepeat} autoSim={autoSim} onAutoSim={setAutoSim} />}
    {tab === "profil" && employeeScreen && <Employees onBack={() => setEmployeeScreen(false)} employees={employees} onAdd={() => openEmployee()} onEdit={openEmployee} onRemove={removeEmployee} />}
    <BottomNav tab={tab} onTab={go} onQris={() => setQrisModal(true)} />
    <QrisModal visible={qrisModal} onClose={() => setQrisModal(false)} onStatic={() => { setQrisModal(false); setTimeout(() => setQrisPrintModal(true), 320); }} onDynamic={() => { setQrisModal(false); setTimeout(() => setQrisDynamicModal(true), 320); }} />
    <OutletModal visible={outletModal} selected={selectedOutlet} onSelect={(v) => { setSelectedOutlet(v); setOutletModal(false); }} onClose={() => setOutletModal(false)} />
    <NotificationModal visible={notificationModal} onClose={() => setNotificationModal(false)} notifications={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} />
    <EmployeeModal visible={employeeModal} editing={editing} onClose={() => setEmployeeModal(false)} onSave={(value) => { setEmployees((old) => editing ? old.map((e) => e.id === editing.id ? { ...e, ...value } : e) : [...old, { ...value, id: String(Date.now()) }]); setEmployeeModal(false); }} />
    <QrisPrintModal visible={qrisPrintModal} outlet={selectedOutlet} onClose={() => setQrisPrintModal(false)} onToast={showToast} />
    <QrisDynamicModal visible={qrisDynamicModal} outlet={selectedOutlet} onClose={() => setQrisDynamicModal(false)} onToast={showToast} />
    <Toast text={toast} />
  </View></SafeAreaView>;
}
