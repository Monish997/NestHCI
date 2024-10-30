import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput } from "react-native";
import { ThemedView } from "./ThemedView";

type InputProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  text: string;
  onChange: (newText: string) => void;
};

export function Input({ icon, placeholder, text, onChange }: InputProps) {
  const backgroundColor = useThemeColor({}, "background");
  const foregroundColor = useThemeColor({}, "text");
  return (
    <ThemedView style={styles.container}>
      {icon && <Ionicons name={icon} size={24} color={foregroundColor} style={{ margin: 5 }} />}
      <TextInput
        style={[styles.input, { color: foregroundColor }]}
        placeholder={placeholder}
        placeholderTextColor={foregroundColor}
        value={text}
        onChangeText={(newText) => onChange(newText)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 15,
    borderColor: "blue",
    borderWidth: 1,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "400",
  },
});
