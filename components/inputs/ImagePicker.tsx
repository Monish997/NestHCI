import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ImagePickerComponentProps {
  value?: { uri: string; fileName: string } | null; // Represents the selected image
  onChange: (image: { uri: string; fileName: string } | null) => void;
  placeholder: React.ReactNode; // Placeholder component when no image is selected
}

export function ImagePickerComponent({ value, onChange, placeholder }: ImagePickerComponentProps) {
  const [image, setImage] = useState(value);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = {
        uri: result.assets[0].uri,
        fileName: result.assets[0].uri.split("/").pop() || "image.jpg",
      };
      setImage(selectedImage);
      onChange(selectedImage);
    }
  };

  const removeImage = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <ThemedView style={styles.container}>
      {image ? (
        <ThemedView style={styles.selectedContainer}>
          <Image source={{ uri: image.uri }} style={styles.thumbnail} />
          <ThemedText style={styles.fileName}>{image.fileName}</ThemedText>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <FontAwesome name="pencil" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={removeImage} style={styles.iconButton}>
            <FontAwesome name="trash" size={20} color="red" />
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <TouchableOpacity onPress={pickImage} style={{ width: "100%" }}>
          {placeholder}
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconButton: {
    marginLeft: 10,
  },
});
