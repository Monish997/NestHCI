import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";

type InputProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  value: string;
  onChange: (newValue: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
  multiline?: boolean;
  style?: ViewStyle;
};

export function Input({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType = "default",
  multiline = false,
  style,
}: InputProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  return (
    <ThemedView style={[styles.container, style]}>
      {icon && <Ionicons name={icon} size={24} color={textColor} style={{ margin: 5 }} />}
      <TextInput
        style={[
          styles.input,
          { color: textColor, textAlignVertical: multiline ? "top" : "center" },
        ]}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
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
    padding: 10,
  },
  input: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "400",
  },
});
