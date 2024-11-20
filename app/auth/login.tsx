import { signIn } from "@/api/auth";
import { GradientButton } from "@/components/buttons/GradientButton";
import { Input } from "@/components/inputs/Input";
import { SecureInput } from "@/components/inputs/SecureInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext"; // Adjust the path as necessary
import { setAuthUserFromSession } from "@/utils";
import { Link, Redirect, useRouter } from "expo-router";
import { useFormik } from "formik";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
    .required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const { user, setAuthUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      signIn(values)
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
        Login
      </ThemedText>
      <ThemedView style={{ gap: 20 }}>
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

        <GradientButton
          text="Login"
          icon="log-in"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={formik.handleSubmit}
        />

        <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
          Don't have an account? &nbsp;
          <Link href="/auth/register">
            <ThemedText type="link">Register</ThemedText>
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
