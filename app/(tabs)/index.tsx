import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import DiaryCard from "../../src/components/DiaryCard";
import {
  setMoodFilter,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOOD_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "😊 Senang", value: "😊" },
  { label: "🚀 Produktif", value: "🚀" },
  { label: "😌 Tenang", value: "😌" },
  { label: "🤔 Berpikir", value: "🤔" },
  { label: "😴 Lelah", value: "😴" },
];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const entries = useAppSelector((state) => state.diary.entries);
  const moodFilter = useAppSelector((state) => state.diary.moodFilter);

  const totalDiary = entries.length;
  const totalFavorite = entries.filter((item) => item.liked).length;

  const filteredEntries =
    moodFilter === "all"
      ? entries
      : entries.filter((item) => item.mood === moodFilter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>
      <Text style={styles.subtitle}>Catatan harian tersinkronisasi dengan Redux</Text>

      {/* Statistik Total Diary & Total Favorite */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDiary}</Text>
          <Text style={styles.statLabel}>Total Diary</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.danger }]}>
            {totalFavorite}
          </Text>
          <Text style={styles.statLabel}>Total Favorite</Text>
        </View>
      </View>

      {/* Filter Mood */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {MOOD_FILTERS.map((f) => {
            const active = moodFilter === f.value;
            return (
              <Pressable
                key={f.value}
                onPress={() => dispatch(setMoodFilter(f.value))}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={item.liked}
            onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
            onPress={() =>
              router.push({
                pathname: "/detail/[id]",
                params: { id: String(item.id) },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📔</Text>
            <Text style={styles.emptyTitle}>
              {moodFilter === "all"
                ? "Belum Ada Catatan Diary"
                : `Tidak Ada Diary dengan Mood ${moodFilter}`}
            </Text>
            <Text style={styles.emptyDesc}>
              {moodFilter === "all"
                ? "Mulai tulis cerita atau pengalaman harimu melalui tab Tambah di bawah."
                : "Coba pilih filter mood lain atau tampilkan semua catatan diary."}
            </Text>
            {moodFilter !== "all" ? (
              <Pressable
                onPress={() => dispatch(setMoodFilter("all"))}
                style={styles.emptyBtn}
              >
                <Text style={styles.emptyBtnText}>Tampilkan Semua</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/(tabs)/create")}
                style={styles.emptyBtn}
              >
                <Text style={styles.emptyBtnText}>+ Buat Diary Pertama</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACE.l,
    paddingTop: 48,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
    marginBottom: SPACE.m,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACE.m,
    marginBottom: SPACE.m,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.m,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: "600",
  },
  filterWrapper: {
    marginBottom: SPACE.m,
  },
  filterRow: {
    gap: SPACE.s,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.xl,
    marginTop: SPACE.l,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: SPACE.s,
  },
  emptyTitle: {
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACE.l,
  },
  emptyBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
