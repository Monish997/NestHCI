import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function Header({ text }: { text: string }) {
  const borderBottomColor = useThemeColor({ light: "black", dark: "white" }, "text");
  return (
    <ThemedView style={[styles.header, { borderBottomColor, borderWidth: 1 }]}>
      <ThemedText type="title">{text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
