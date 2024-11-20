import { signUp } from "@/api/auth"; // Adjust the path as necessary
import { GradientButton } from "@/components/buttons/GradientButton";
import { Input } from "@/components/inputs/Input";
import { SecureInput } from "@/components/inputs/SecureInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext"; // Adjust the path as necessary
import { supabase } from "@/services/supabase";
import { setAuthUserFromSession } from "@/utils";
import { Link, Redirect } from "expo-router";
import { useFormik } from "formik";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  name: Yup.string().required("Name is required"),
  username: Yup.string()
    .required("Username is required")
    .test("unique", "Username is already taken", async (value) => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("username", value);
      if (error) {
        throw error;
      }
      return count === 0;
    }),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Register() {
  const { user, setAuthUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      signUp(values)
        .then((session) => {
          setAuthUserFromSession(session, setAuthUser).catch((error) =>
            Toast.show({ type: "error", text1: "Error", text2: error.message })
          );
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
          });
        });
    },
  });

  if (user) {
    return <Redirect href="/(tabs)/events" />;
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 20, gap: 20 }}>
      <ThemedText type="title" style={{ textAlign: "center" }}>
        Register
      </ThemedText>
      <ThemedView style={{ gap: 20 }}>
        <ThemedView>
          <Input
            icon="person"
            placeholder="Name"
            onChange={formik.handleChange("name")}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name ? (
            <Text style={{ color: "red" }}>{formik.errors.name}</Text>
          ) : null}
        </ThemedView>

        <ThemedView>
          <Input
            icon="at"
            placeholder="Username"
            onChange={formik.handleChange("username")}
            value={formik.values.username}
          />
          {formik.errors.username && formik.touched.username ? (
            <Text style={{ color: "red" }}>{formik.errors.username}</Text>
          ) : null}
        </ThemedView>

        <ThemedView>
          <Input
            icon="mail"
            placeholder="Email"
            onChange={formik.handleChange("email")}
            value={formik.values.email}
            keyboardType="email-address"
          />
          {formik.errors.email && formik.touched.email ? (
            <Text style={{ color: "red" }}>{formik.errors.email}</Text>
          ) : null}
        </ThemedView>

        <ThemedView>
          <SecureInput
            icon="lock-closed"
            placeholder="Password"
            onChange={formik.handleChange("password")}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password ? (
            <Text style={{ color: "red" }}>{formik.errors.password}</Text>
          ) : null}
        </ThemedView>

        <ThemedView>
          <SecureInput
            icon="lock-closed"
            placeholder="Confirm Password"
            onChange={formik.handleChange("confirmPassword")}
            value={formik.values.confirmPassword}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <Text style={{ color: "red" }}>{formik.errors.confirmPassword}</Text>
          ) : null}
        </ThemedView>

        <GradientButton
          text="Register"
          icon="person-add"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={formik.handleSubmit}
        />

        <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
          Already have an account? &nbsp;
          <Link href="/auth/login">
            <ThemedText type="link">Login</ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
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
});
