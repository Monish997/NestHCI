import { getEvents } from "@/api/events";
import { EventCard } from "@/components/EventCard";
import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ScrollView } from "react-native";

export default function Home() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        gap: 15,
      }}
    >
      <Header text="Home" />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        <ThemedText type="semiBold">Suggested for you</ThemedText>
        {getEvents().map((event) => (
          <EventCard
            key={event.id}
            name={event.name}
            date={event.date}
            city={event.city}
            fromTime={event.fromTime}
            locationName={event.locationName}
            organiser={event.organiser.username}
            thumbnailURL={event.thumbnail}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}
