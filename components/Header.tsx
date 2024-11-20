import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type HeaderProps = {
  text: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
};

export function Header({ text, leftComponent, rightComponent }: HeaderProps) {
  const borderBottomColor = useThemeColor({ light: "black", dark: "white" }, "text");
  return (
    <ThemedView style={[styles.header, { borderBottomColor, borderWidth: 1 }]}>
      {leftComponent}
      <ThemedText type="title" style={styles.title}>
        {text}
      </ThemedText>
      {rightComponent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // create styles for the header such that the left component sticks to the left and the right component sticks to the right
  // but the text is centered
  header: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    flex: 1,
  },
});
