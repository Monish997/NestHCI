import { Text } from "@/components/Debugabble";
import { type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "semiBold" | "subtitle" | "link" | "muted";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "semiBold" ? styles.semiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "muted" ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "MavenPro",
    fontSize: 16,
  },
  muted: {
    color: "#637387",
  },
  semiBold: {
    fontSize: 20,
    fontWeight: "semibold",
  },
  title: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "medium",
  },
  link: {
    color: "#0a7ea4",
  },
});
