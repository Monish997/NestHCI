import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GradientButton } from "@/components/buttons/GradientButton";
import { useAuth } from "@/contexts/AuthContext";
import { ResizeMode, Video } from "expo-av";
import { Redirect, useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";

export default function Welcome() {
  const router = useRouter();
  const video = useRef(null);
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)/events" />;
  }

  return (
    <ThemedView style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={require("../assets/videos/background.mp4")} // Can be a URL or a local file
        resizeMode={ResizeMode.COVER}
        shouldPlay // Starts playback automatically
        isLooping // Loops the video
        isMuted // Mutes the video
      />
      <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
        <ThemedText style={styles.title}>Welcome to NEST</ThemedText>
        <ThemedText style={{ textAlign: "center", fontSize: 24 }}>Events made Easy</ThemedText>
      </ThemedView>
      <ThemedView
        style={{ paddingBottom: 100, paddingHorizontal: 20, backgroundColor: "transparent" }}
      >
        <GradientButton
          text="Login"
          icon="log-in"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => router.push("/auth/login")}
        />
        <GradientButton
          text="Register"
          icon="person-add"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => router.push("/auth/register")}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  video: {
    position: "absolute",
    top: 0,
    width: "110%",
    height: "110%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    fontFamily: "MavenPro",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "900",
  },
  button: {
    height: 50,
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 25,
  },
  buttonText: {
    fontSize: 18,
  },
});
