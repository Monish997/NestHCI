import { getEventsForUser } from "@/api/going";
import { EventCardMini } from "@/components/cards/EventCardMini";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { NestEvent } from "@/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

function groupEventsByDate(events: NestEvent[]) {
  return events.reduce((acc, event) => {
    const date = event.start_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});
}

export default function Calendar() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<NestEvent[]>([]);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      getEventsForUser(user?.id)
        .then((events) => {
          setEvents(events);
        })
        .catch((error) => {
          console.error("Error getting events for user", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])
  );

  if (loading) {
    return <Loading text="Loading events..." />;
  }

  const groupedEvents = groupEventsByDate(events);

  return (
    <ThemedView style={{ flex: 1, justifyContent: "flex-start", gap: 15 }}>
      <Header text="Calendar" />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        {groupedEvents
          ? Object.entries(groupedEvents).map(([date, eventsForDate]) => (
              <ThemedView key={date}>
                <ThemedText type="semiBold" style={{ marginTop: 10, marginBottom: 5 }}>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </ThemedText>
                {eventsForDate.map((event) => (
                  <EventCardMini key={event.id} event={event} />
                ))}
                <ThemedView
                  style={{ borderTopWidth: 1, borderColor: "#637387", marginVertical: 10 }}
                />
              </ThemedView>
            ))
          : null}
      </ScrollView>
    </ThemedView>
  );
}
