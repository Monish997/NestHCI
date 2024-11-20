import { BaseButtonProps } from "@/components/buttons/BaseGradientButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { View } from "../Debugabble";
import { ThemedText } from "../ThemedText";

type ButtonProps = BaseButtonProps & {
  onPress?: TouchableOpacityProps["onPress"];
  colors?: LinearGradientProps["colors"];
  style?: LinearGradientProps["style"];
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  text: string;
  textStyle?: TextStyle;
};

export function GradientButton({
  text,
  onPress,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  colors = ["#ff3520", "#cdae32"],
}: ButtonProps) {
  const foregroundColor = useThemeColor({}, "text");
  return (
    <LinearGradient colors={colors} start={[0, 0]} end={[1, 1]} style={style}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={{ flexDirection: "row" }}>
          {iconPosition === "left" && icon && (
            <Ionicons name={icon} size={24} color={foregroundColor} />
          )}
          <ThemedText style={[{ textAlign: "center", flex: 1 }, textStyle]}>{text}</ThemedText>
          {iconPosition === "right" && icon && <Ionicons name={icon} size={24} />}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center", // Center children vertically
  },
});
