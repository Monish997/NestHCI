import { getEventById } from "@/api/events";
import { EventForm } from "@/components/forms/EventForm";
import { Loading } from "@/components/Loading";
import { NestEvent } from "@/types";
import { convertDateFormat, convertTimeFormat } from "@/utils";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

async function fetchData(
  eventId: string,
  setLoading: (loading: boolean) => void,
  setEvent: (event: NestEvent) => void
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
  } finally {
    setLoading(false);
  }
}

export default function EditEvent() {
  const router = useRouter();
  const { eventId }: { eventId: string } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<NestEvent | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchData(eventId, setLoading, setEvent);
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
    <EventForm
      edit
      id={event.id}
      intialValues={{
        eventName: event.name,
        description: event.description,
        startDate: convertDateFormat(event.start_date),
        startTime: convertTimeFormat(event.start_time, true),
        endDate: convertDateFormat(event.end_date),
        endTime: convertTimeFormat(event.end_time, true),
        locationName: event.location_name,
        locationUrl: event.location_url,
        city: event.city,
        thumbnail: event.thumbnail,
      }}
    />
  );
}
