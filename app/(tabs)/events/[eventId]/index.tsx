import { getEventById } from "@/api/events";
import { addGoing, isUserGoing, removeGoing } from "@/api/going";
import { addInterest, isUserInterested, removeInterest } from "@/api/interests";
import { GradientButton } from "@/components/buttons/GradientButton";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SUPABASE_URL } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NestEvent } from "@/types";
import { convertTimeFormat } from "@/utils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

async function fetchData(
  eventId: string,
  userId: string,
  setLoading: (loading: boolean) => void,
  setEvent: (event: NestEvent) => void,
  setIsGoing: (isGoing: boolean) => void,
  setIsInterested: (isInterested: boolean) => void
) {
  setLoading(true);

  try {
    const event = await getEventById(eventId);
    setEvent(event);
  } catch (error) {
    console.error("Error fetching event", error);
    Toast.show({
      type: "error",
      text1: "Error fetching event",
      text2: error.message,
    });
  }

  try {
    const isGoing = await isUserGoing(eventId, userId);
    setIsGoing(isGoing);
  } catch (error) {
    console.error("Error checking if user is going", error);
    Toast.show({
      type: "error",
      text1: "Error checking if user is going",
      text2: error.message,
    });
    setIsGoing(false);
  }

  try {
    const isInterested = await isUserInterested(eventId, userId);
    setIsInterested(isInterested);
  } catch (error) {
    console.error("Error checking if user is interested", error);
    Toast.show({
      type: "error",
      text1: "Error checking if user is interested",
      text2: error.message,
    });
    setIsInterested(false);
  }

  setLoading(false);
}

export default function Event() {
  const foregroundColor = useThemeColor({}, "text");
  const { eventId }: { eventId: string } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<NestEvent | null>(null);
  const [isGoing, setIsGoing] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData(eventId, user?.id, setLoading, setEvent, setIsGoing, setIsInterested);
    }, [])
  );

  if (loading) {
    return <Loading text="Loading event..." />;
  }

  if (!event) {
    router.back();
    return null;
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        gap: 15,
      }}
    >
      <Header
        text=""
        rightComponent={
          event?.organiser.id === user?.id ? (
            <FontAwesome
              name="pencil-square-o"
              size={24}
              color={foregroundColor}
              onPress={() => {
                router.push(`/events/${eventId}/edit`);
              }}
            />
          ) : null
        }
      />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        <Image
          source={{
            uri: `${SUPABASE_URL}/storage/v1/object/public/${event.thumbnail}`,
          }}
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            marginBottom: 15,
          }}
        />
        <ThemedView style={{ paddingHorizontal: 15, flexDirection: "column", gap: 10 }}>
          <ThemedText type="title">{event.name}</ThemedText>

          <ThemedView style={{ flexDirection: "row", gap: 15 }}>
            <Ionicons name="calendar-outline" size={20} color={foregroundColor} />
            <ThemedText>{new Date(event.start_date).toDateString()}</ThemedText>
          </ThemedView>

          <ThemedView style={{ flexDirection: "row", gap: 15 }}>
            <Ionicons name="time-outline" size={20} color={foregroundColor} />
            <ThemedText>
              {convertTimeFormat(event.start_time)} - {convertTimeFormat(event.end_time)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={{ flexDirection: "row", gap: 15 }}>
            <Ionicons name="ticket-outline" size={20} color={foregroundColor} />
            <ThemedText>
              {event.num_going} going, {event.num_interested} interested
            </ThemedText>
          </ThemedView>

          <ThemedView style={{ flexDirection: "row", gap: 15 }}>
            <Ionicons name="person-outline" size={20} color={foregroundColor} />
            <ThemedText>Organised by @{event.organiser.username}</ThemedText>
          </ThemedView>

          <ThemedView style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
            <GradientButton
              text={isGoing ? "Unregister" : "Register"}
              onPress={() => {
                (isGoing ? removeGoing(event.id, user?.id) : addGoing(event.id, user?.id))
                  .then(() => {
                    setIsGoing(!isGoing);
                    Toast.show({
                      type: "success",
                      text1: isGoing ? "Unregistered" : "Registered",
                      text2: isGoing
                        ? "You have unregistered from this event"
                        : "You have registered for this event",
                    });
                  })
                  .catch((error) => {
                    console.error("Error toggling going", error);
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2: error.message,
                    });
                  });
              }}
              style={styles.registerButton}
            />
            <FontAwesome
              name={isInterested ? "star" : "star-o"}
              size={30}
              color={foregroundColor}
              onPress={() => {
                (isInterested
                  ? removeInterest(event.id, user?.id)
                  : addInterest(event.id, user?.id)
                )
                  .then(() => {
                    setIsInterested(!isInterested);
                    Toast.show({
                      type: "success",
                      text1: isInterested ? "Interest Removed" : "Interest Added",
                      text2: isInterested
                        ? "You have removed your interest in this event"
                        : "You have added your interest in this event",
                    });
                  })
                  .catch((error) => {
                    console.error("Error toggling interest", error);
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2: error.message,
                    });
                  });
              }}
            />
          </ThemedView>

          <ThemedText type="title">Venue</ThemedText>
          <ThemedView style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
            <Ionicons name="location-outline" size={20} color={foregroundColor} />
            <ThemedView style={{ flexWrap: "wrap" }}>
              <ThemedText>
                {event.location_name}, {event.city}
              </ThemedText>
              <ThemedText type="link">
                <Link href={event.location_url}>Click here to open</Link>
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText type="title">Description</ThemedText>
          <ThemedText>{event.description}</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  registerButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
