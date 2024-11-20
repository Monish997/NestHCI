import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { NestEvent } from "@/types";
import { convertTimeFormat } from "@/utils";
import { SUPABASE_URL } from "@/constants";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export function EventCardMini({ event }: { event: NestEvent }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/events/${event.id}`);
      }}
    >
      <ThemedView style={styles.container}>
        <Image
          source={{
            uri: event.thumbnail
              ? `${SUPABASE_URL}/storage/v1/object/public/${event.thumbnail}`
              : require("../../assets/images/image-placeholder.png"),
          }}
          style={styles.image}
        />
        <ThemedView
          style={{ flex: 1, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
        >
          <ThemedText type="title">{event.name}</ThemedText>
          <ThemedText>
            {new Date(event.start_date).toDateString()}
            {", "}
            {convertTimeFormat(event.start_time)}
          </ThemedText>
          <ThemedText>
            {event.location_name}, {event.city}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    borderRadius: 10,
    aspectRatio: 1,
  },
  container: {
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#637387",
    borderWidth: 2,
  },
});
