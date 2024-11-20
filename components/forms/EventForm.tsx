import { GradientButton } from "@/components/buttons/GradientButton";
import { Header } from "@/components/Header";
import { Input } from "@/components/inputs/Input";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CITIES, SUPABASE_URL } from "@/constants";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import * as Yup from "yup";

import { createEvent, updateEvent } from "@/api/events";
import { ImagePickerComponent as ImagePicker } from "@/components/inputs/ImagePicker";
import { useAuth } from "@/contexts/AuthContext";
import { toDateObject } from "@/utils";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

type EventFormValues = {
  eventName: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationName: string;
  locationUrl: string;
  city: string;
  thumbnail: string | null;
  updatedThumbnail?: string | null;
};

type EventFormProps = {
  intialValues?: EventFormValues;
  id?: string;
  edit?: boolean;
};

const EventSchema = Yup.object().shape({
  eventName: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  startDate: Yup.string().required("Start Date is required"),
  startTime: Yup.string().required("Start Time is required"),
  endDate: Yup.string()
    .required("End Date is required")
    .test("is-gte", "End Date should be after start date", function (endDate) {
      const { startDate } = this.parent;
      return toDateObject(endDate, "12:00:00 AM") >= toDateObject(startDate, "12:00:00 AM");
    }),
  endTime: Yup.string()
    .required("End Time is required")
    .test("is-greater", "End Time is should be after start time", function (endTime) {
      const { startDate, startTime, endDate } = this.parent;
      return toDateObject(endDate, endTime) > toDateObject(startDate, startTime);
    }),
  locationName: Yup.string().required("Location is required"),
  locationUrl: Yup.string().url("Location URL is invalid").required("Location URL is required"),
  city: Yup.string().oneOf(CITIES).required("City is required"),
  thumbnail: Yup.string().nullable(),
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
      <ThemedText>Tap to select thumbnail</ThemedText>
    </ThemedView>
  );
}

export function EventForm({ intialValues, id, edit = false }: EventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const foregroundColor = useThemeColor({}, "text");

  const [date, time] = new Date().toLocaleString().split(", ");

  const formik = useFormik({
    initialValues: intialValues || {
      eventName: "",
      description: "",
      startDate: date,
      startTime: time,
      endDate: date,
      endTime: time,
      locationName: "",
      locationUrl: "",
      city: "",
      thumbnail: null,
      ...(edit ? { updatedThumbnail: null } : {}),
    },
    validationSchema: EventSchema,
    onSubmit: (values) => {
      (edit ? updateEvent(id, values) : createEvent(values, user))
        .then(() => {
          formik.resetForm();
          Toast.show({
            type: "success",
            text1: edit ? "Event edited successfully" : "Event created successfully",
          });
          router.back();
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: edit ? "Failed to edit event" : "Failed to create event",
            text2: error.message,
          });
        });
    },
  });

  const getOnChange = (field: string, currentMode: "date" | "time") => {
    return (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
      if (!selectedDate) return;
      const [date, time] = selectedDate.toLocaleString().split(", ");
      formik.setFieldValue(field, currentMode === "date" ? date : time);
    };
  };

  const showMode = (currentMode: "date" | "time", field: string) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: getOnChange(field, currentMode),
      mode: currentMode,
      is24Hour: false,
    });
  };

  if (edit && !(intialValues && id)) {
    throw new Error("id and intialValues are required for edit mode");
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: "flex-start", gap: 15 }}>
      <Header
        text={edit ? "Edit Event" : "Create Event"}
        rightComponent={
          <TouchableOpacity
            style={{ height: 36, justifyContent: "center" }}
            onPress={() => {
              formik.resetForm();
              router.back();
            }}
          >
            <ThemedText type="default">Cancel</ThemedText>
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ paddingHorizontal: 10, gap: 15 }}>
        <ThemedView style={{ gap: 15 }}>
          <ThemedView>
            <ThemedText style={styles.label}>Event name</ThemedText>
            <Input
              placeholder="Event name"
              onChange={formik.handleChange("eventName")}
              value={formik.values.eventName}
            />
            {formik.errors.eventName && formik.touched.eventName ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.eventName}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView>
            <ThemedText style={styles.label}>Description</ThemedText>
            <Input
              placeholder="Description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
              multiline={true}
              style={{ height: 200 }}
            />
            {formik.errors.description && formik.touched.description ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.description}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView>
            <ThemedText style={styles.label}>Starts</ThemedText>
            <ThemedView style={{ flexDirection: "row" }}>
              <ThemedView style={{ flexDirection: "row", width: "50%", gap: 15 }}>
                <ThemedText>{formik.values.startDate}</ThemedText>
                <Ionicons
                  name="calendar"
                  size={24}
                  color={foregroundColor}
                  onPress={() => {
                    showMode("date", "startDate");
                  }}
                />
              </ThemedView>
              <ThemedView style={{ flexDirection: "row", width: "50%", gap: 15 }}>
                <ThemedText>{formik.values.startTime}</ThemedText>
                <Ionicons
                  name="time"
                  size={24}
                  color={foregroundColor}
                  onPress={() => {
                    showMode("time", "startTime");
                  }}
                />
              </ThemedView>
            </ThemedView>

            <ThemedText style={styles.label}>Ends</ThemedText>
            <ThemedView style={{ flexDirection: "row" }}>
              <ThemedView style={{ flexDirection: "row", width: "50%", gap: 15 }}>
                <ThemedText>{formik.values.endDate}</ThemedText>
                <Ionicons
                  name="calendar"
                  size={24}
                  color={foregroundColor}
                  onPress={() => {
                    showMode("date", "endDate");
                  }}
                />
              </ThemedView>
              <ThemedView style={{ flexDirection: "row", width: "50%", gap: 15 }}>
                <ThemedText>{formik.values.endTime}</ThemedText>
                <Ionicons
                  name="time"
                  size={24}
                  color={foregroundColor}
                  onPress={() => {
                    showMode("time", "endTime");
                  }}
                />
              </ThemedView>
            </ThemedView>

            {formik.errors.endDate && formik.touched.endDate ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.endDate}</ThemedText>
            ) : null}
            {formik.errors.endTime && formik.touched.endTime ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.endTime}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView>
            <ThemedText style={styles.label}>Location name</ThemedText>
            <Input
              placeholder="Location name"
              onChange={formik.handleChange("locationName")}
              value={formik.values.locationName}
            />
            {formik.errors.locationName && formik.touched.locationName ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.locationName}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView>
            <ThemedText style={styles.label}>Location URL</ThemedText>
            <Input
              placeholder="https://www.google.com/maps/..."
              onChange={formik.handleChange("locationUrl")}
              value={formik.values.locationUrl}
              keyboardType="url"
            />
            {formik.errors.locationUrl && formik.touched.locationUrl ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.locationUrl}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView>
            <ThemedText style={styles.label}>City</ThemedText>
            <RNPickerSelect
              onValueChange={(value) => formik.setFieldValue("city", value)}
              items={CITIES.map((i) => ({ label: i, value: i }))}
              placeholder={
                edit
                  ? { label: intialValues?.city, value: intialValues?.city }
                  : { label: "Select a city", value: null }
              }
              style={{
                inputAndroid: { color: foregroundColor },
              }}
            />
            {formik.errors.city && formik.touched.city ? (
              <ThemedText style={{ color: "red" }}>{formik.errors.city}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedText>Thumbnail</ThemedText>
          {edit && (
            <ThemedView style={styles.selectedContainer}>
              <Image
                source={{
                  uri: `${SUPABASE_URL}/storage/v1/object/public/${intialValues?.thumbnail}`,
                }}
                style={styles.thumbnail}
              />
              <ThemedText style={styles.fileName}>{intialValues?.thumbnail}</ThemedText>
            </ThemedView>
          )}
          <ImagePicker
            placeholder={<ImagePickerPlaceholder />}
            onChange={(image) => {
              formik.setFieldValue(edit ? "updatedThumbnail" : "thumbnail", image?.uri);
            }}
          />
        </ThemedView>

        <GradientButton
          text={edit ? "Edit Event" : "Create Event"}
          onPress={formik.handleSubmit}
          style={styles.button}
          textStyle={styles.buttonText}
        />
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
  buttonText: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
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
});
