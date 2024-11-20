import { SUPABASE_URL } from "@/constants";
import { NestEvent } from "@/types";
import { convertTimeFormat } from "@/utils";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday = today.toDateString() === date.toDateString();
  const isTomorrow = tomorrow.toDateString() === date.toDateString();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  // Format as "DayOfWeek, ShortMonthName Date"
  const dayOfWeek = date.toLocaleString("default", { weekday: "long" });
  const monthName = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  return `${dayOfWeek}, ${monthName} ${day}`;
};

export function EventCard({ event }: { event: NestEvent }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/events/${event.id}`);
      }}
    >
      <ThemedView style={styles.card}>
        <Image
          source={{
            uri: event.thumbnail
              ? `${SUPABASE_URL}/storage/v1/object/public/${event.thumbnail}`
              : require("../../assets/images/image-placeholder.png"),
          }}
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        />
        <ThemedView
          style={{ padding: 10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
        >
          <ThemedText type="semiBold">{event.name}</ThemedText>
          <ThemedText type="muted">
            {formatDate(event.start_date)}, {convertTimeFormat(event.start_time)}
          </ThemedText>
          <ThemedText type="muted">
            {event.location_name}, {event.city}
          </ThemedText>
          <ThemedText type="muted">Organised by @{event.organiser.username}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginVertical: 10,
    borderColor: "#637387",
    borderWidth: 2,
  },
  container: {
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 5,
  },
});
