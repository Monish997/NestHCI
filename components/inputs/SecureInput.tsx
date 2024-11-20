import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type InputProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  value: string;
  onChange: (newText: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
};

export function SecureInput({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType = "default",
}: InputProps) {
  const [isSecure, setIsSecure] = useState(true);

  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  return (
    <ThemedView style={styles.container}>
      {icon && <Ionicons name={icon} size={24} color={textColor} style={{ margin: 5 }} />}
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        value={value}
        onChangeText={(newText) => onChange(newText)}
        secureTextEntry={isSecure}
        keyboardType={isSecure ? "default" : "visible-password"}
      />
      <Ionicons
        name={isSecure ? "eye-off" : "eye"}
        size={24}
        color={textColor}
        style={{ margin: 5 }}
        onPress={() => setIsSecure(!isSecure)}
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
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "400",
  },
});
