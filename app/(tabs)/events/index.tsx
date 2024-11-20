import { getEvents } from "@/api/events";
import { EventCard } from "@/components/cards/EventCard";
import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { NestEvent } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

export default function Home() {
  const [events, setEvents] = useState<NestEvent[]>([]);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      getEvents()
        .then((data) => {
          setEvents(data);
        })
        .catch((error) => {
          Toast.show({
            text1: "Error fetching events",
            text2: error.message,
            type: "error",
          });
        });
    }, [])
  );

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        gap: 15,
      }}
    >
      <Header text="Events" />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        <ThemedText type="semiBold">Suggested for you</ThemedText>
        {events.map((event: NestEvent) => (
          <ThemedView key={event.id}>
            <EventCard event={event} />
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
