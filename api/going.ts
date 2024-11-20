import { supabase } from "@/services/supabase";
import { sortEvents } from "@/utils";

export async function isUserGoing(eventId: string, userId: string) {
  const { count, error } = await supabase
    .from("going")
    .select("*", { count: "exact", head: true })
    .eq("event", eventId)
    .eq("user", userId);
  if (error) {
    console.error("Error checking if user is going", error);
    throw error;
  }
  return count > 0;
}

export async function addGoing(eventId: string, userId: string) {
  const { data, error } = await supabase.from("going").insert({
    event: eventId,
    user: userId,
  });
  if (error) {
    console.error("Error adding going", error);
    throw error;
  }
  return data;
}

export async function removeGoing(eventId: string, userId: string) {
  const { error } = await supabase.from("going").delete().eq("event", eventId).eq("user", userId);
  if (error) {
    console.error("Error removing going", error);
    throw error;
  }
}

export async function getEventsForUser(userId: string) {
  const { data, error } = await supabase.rpc("get_registered_events", { user_id: userId });
  if (error) {
    console.error("Error getting events for user", error);
    throw error;
  }
  return sortEvents(data);
}
