import { ActivityIndicator } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet } from "react-native";

export function Loading({ text }: { text: string }) {
  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <ThemedText>{text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
