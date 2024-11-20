import { supabase } from "@/services/supabase";

export async function isUserInterested(eventId: string, userId: string) {
  const { count, error } = await supabase
    .from("interests")
    .select("*", { count: "exact", head: true })
    .eq("event", eventId)
    .eq("user", userId);
  if (error) {
    console.error("Error checking if user is interested", error);
    throw error;
  }
  return count > 0;
}

export async function addInterest(eventId: string, userId: string) {
  const { data, error } = await supabase.from("interests").insert({
    event: eventId,
    user: userId,
  });
  if (error) {
    console.error("Error adding interest", error);
    throw error;
  }
  return data;
}

export async function removeInterest(eventId: string, userId: string) {
  const { error } = await supabase
    .from("interests")
    .delete()
    .eq("event", eventId)
    .eq("user", userId);
  if (error) {
    console.error("Error removing interest", error);
    throw error;
  }
}
