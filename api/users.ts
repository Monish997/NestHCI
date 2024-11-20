import { supabase } from "@/services/supabase";

export async function getUserProfile(id: any) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateUser(id: any, update: any) {
  const { data, error } = await supabase.from("users").update(update).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
