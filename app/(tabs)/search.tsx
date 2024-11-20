import { getEvents, searchEvents } from "@/api/events";
import { Header } from "@/components/Header";
import { Input } from "@/components/inputs/Input";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CITIES } from "@/constants";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NestEvent } from "@/types";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { EventCard } from "@/components/cards/EventCard";
import RNPickerSelect from "react-native-picker-select";

export default function Search() {
  const foregroundColor = useThemeColor({}, "text");
  const [text, setText] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [events, setEvents] = useState<NestEvent[]>([]);

  useEffect(() => {
    if (text) {
      searchEvents(text, city).then(setEvents);
    } else {
      getEvents().then(setEvents);
    }
  }, [text, city]);

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        gap: 15,
      }}
    >
      <Header text="Search" />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        <Input value={text} onChange={setText} placeholder="Search events" icon="search-outline" />
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText type="semiBold">City:</ThemedText>
          <RNPickerSelect
            onValueChange={setCity}
            items={CITIES.map((i) => ({ label: i, value: i }))}
            value={city}
            style={{
              inputAndroid: { color: foregroundColor, width: 340 },
            }}
          />
        </ThemedView>
        <ThemedText type="semiBold">Results</ThemedText>
        {events.map((event: NestEvent) => (
          <ThemedView key={event.id}>
            <EventCard event={event} />
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
