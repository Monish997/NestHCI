import { getEventsByUser } from "@/api/events";
import { updateUser } from "@/api/users";
import { GradientButton } from "@/components/buttons/GradientButton";
import { EventCardMini } from "@/components/cards/EventCardMini";
import { Header } from "@/components/Header";
import { ImagePickerComponent as ImagePicker } from "@/components/inputs/ImagePicker";
import { Input } from "@/components/inputs/Input";
import { Loading } from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SUPABASE_URL } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/services/supabase";
import { uploadFileToStorage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { getTsid } from "tsid-ts";
import * as Yup from "yup";

const BioSchema = Yup.object().shape({
  description: Yup.string().max(200, "Bio must be less than 200 characters"),
});

function ImagePickerPlaceholder() {
  const foregroundColor = useThemeColor({}, "text");
  return (
    <ThemedView
      style={{
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 15,
      }}
    >
      <Ionicons name="image-outline" size={40} color={foregroundColor} />
      <ThemedText>Select new profile picture</ThemedText>
    </ThemedView>
  );
}

export default function Me() {
  const router = useRouter();
  const { user, setAuthUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getEventsByUser(user?.id)
        .then((events) => {
          setEvents(events);
        })
        .catch((error) => {
          Toast.show({ type: "error", text1: "Error", text2: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])
  );

  const formik = useFormik({
    initialValues: {
      bio: user?.bio || "",
      profile_pic: null,
    },
    validationSchema: BioSchema,
    onSubmit: async (values) => {
      try {
        const update = { bio: values.bio, profile_pic: user?.profile_pic };
        if (values.profile_pic) {
          const newFileName = getTsid().toString();
          const fileUploadData = await uploadFileToStorage(
            values.profile_pic,
            "profile_pic",
            newFileName,
            "image/*"
          );
          update.profile_pic = fileUploadData.fullPath;
        }
        updateUser(user?.id, update);
        setAuthUser({ ...user, ...update });
        Toast.show({ type: "success", text1: "Success", text2: "Bio updated" });
        setEditMode(false);
      } catch (error) {
        Toast.show({ type: "error", text1: "Error", text2: error.message });
      }
    },
  });
  const [editMode, setEditMode] = useState(false);
  const foregroundColor = useThemeColor({}, "text");

  if (loading) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: "flex-start", gap: 15 }}>
      <Header
        text="Profile"
        rightComponent={
          <TouchableOpacity
            style={{ height: "100%", alignItems: "center", flexDirection: "row", gap: 10 }}
            onPress={() => supabase.auth.signOut()}
          >
            <ThemedText>Logout</ThemedText>
            <Ionicons name="log-out-outline" size={24} color={foregroundColor} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ paddingHorizontal: 10, flex: 1 }}>
        <ThemedView style={{ flex: 1, justifyContent: "flex-start", gap: 15 }}>
          <ThemedView style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Image
              source={
                user?.profile_pic
                  ? { uri: `${SUPABASE_URL}/storage/v1/object/public/${user?.profile_pic}` }
                  : require("../../assets/images/default-avatar.png")
              }
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <ThemedView style={{ flex: 1 }}>
              <ThemedText type="title">{user?.name}</ThemedText>
              <ThemedText>@{user?.username}</ThemedText>
            </ThemedView>
          </ThemedView>
          {editMode ? (
            <ImagePicker
              placeholder={<ImagePickerPlaceholder />}
              onChange={(image) => {
                formik.setFieldValue("profile_pic", image?.uri);
              }}
            />
          ) : null}
          <ThemedText type="title">Bio</ThemedText>
          {editMode ? (
            <ThemedView>
              <Input
                placeholder="Bio"
                onChange={formik.handleChange("bio")}
                value={formik.values.bio}
                multiline={true}
                style={{ height: 200 }}
              />
              {formik.errors.bio && formik.touched.bio ? (
                <Text style={{ color: "red" }}>{formik.errors.bio}</Text>
              ) : null}
            </ThemedView>
          ) : (
            <ThemedText>{user?.bio || "This space looks empty—how about a bio?"}</ThemedText>
          )}
          <GradientButton
            text={editMode ? "Save" : "Edit Profile"}
            onPress={() => {
              if (editMode) {
                formik.handleSubmit();
              } else {
                setEditMode(true);
              }
            }}
            style={styles.editButton}
          />
          <ThemedText type="title">Events</ThemedText>

          {events.length > 0 ? (
            events.map((event) => <EventCardMini key={event.id} event={event} />)
          ) : (
            <ThemedText>No events found</ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 25,
  },
  editButton: {
    height: 30,
    borderRadius: 15,
    marginVertical: 6,
    paddingHorizontal: 25,
  },
  buttonText: {
    fontSize: 18,
  },
});
