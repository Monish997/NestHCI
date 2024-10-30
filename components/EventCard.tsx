import { bucketBaseUrl } from "@/constants/ApiEndpoints";
import { Image, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

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

type EventCardProps = {
  name: string;
  date: string;
  fromTime: string;
  locationName: string;
  city: string;
  organiser: string;
  thumbnailURL: string;
};

export function EventCard({
  name,
  date,
  fromTime,
  locationName,
  city,
  organiser,
  thumbnailURL,
}: EventCardProps) {
  return (
    <ThemedView style={styles.card}>
      <Image
        source={{ uri: bucketBaseUrl + "/" + thumbnailURL }}
        style={{
          width: "100%",
          aspectRatio: 16 / 9,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      />
      <ThemedText type="semiBold">{name}</ThemedText>
      <ThemedText type="muted">
        {formatDate(date)}, {fromTime}
      </ThemedText>
      <ThemedText type="muted">
        {locationName}, {city}
      </ThemedText>
      <ThemedText type="muted">Organised by @{organiser}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginVertical: 10,
  },
});
