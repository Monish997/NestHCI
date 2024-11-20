import axios, { Axios } from "axios";
import { supabase } from "@/services/supabase";

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  name: string;
  username: string;
};

async function signUp({ email, password, name, username }: RegisterPayload) {
  const { data: users, error: usernameError } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);
  if (usernameError) {
    throw new Error(usernameError.message);
  }
  if (users.length > 0) {
    throw new Error("Username is already taken");
  }
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { name, username },
    },
  });
  if (error) {
    throw new Error(error.message);
  }

  if (!session) {
    throw new Error("An error occurred while signing up");
  }

  const { error: insertError } = await supabase
    .from("users")
    .upsert({ id: session.user?.id, name, username, bio: "" });
  if (insertError) {
    throw new Error(insertError.message);
  }

  return session;
}

async function signIn({ email, password }: AuthPayload) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  if (!session?.user?.confirmed_at) {
    throw new Error("Please verify your email before signing in");
  }
  return session;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export { signUp, signIn, signOut };
