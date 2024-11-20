import { NestEvent } from "@/types";
import axios from "axios";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getTsid } from "tsid-ts";
import { sortEvents, toDateObject, uploadFileToStorage } from "@/utils";

export async function getEvents() {
  const { data, error } = await supabase.rpc("get_events");
  if (error) {
    throw error;
  }
  return sortEvents(data);
}

export async function getEventById(id: string) {
  const { data: eventData, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error getting event by id", error);
    throw error;
  }
  const { data: organiserData, error: organiserError } = await supabase
    .from("users")
    .select("*")
    .eq("id", eventData.organiser)
    .single();
  if (organiserError) {
    console.error("Error getting organiser data", organiserError);
    throw organiserError;
  }

  const { count: num_interested, error: interestedError } = await supabase
    .from("interests")
    .select("user", { count: "exact", head: true })
    .eq("event", id);
  if (interestedError) {
    console.error("Error getting interested data", interestedError);
    throw interestedError;
  }

  const { count: num_going, error: goingError } = await supabase
    .from("going")
    .select("user", { count: "exact", head: true })
    .eq("event", id);
  if (goingError) {
    console.error("Error getting going data", goingError);
    throw goingError;
  }

  const event: NestEvent = {
    ...eventData,
    organiser: organiserData,
    num_interested,
    num_going,
  };
  return event;
}

export async function searchEvents(name: string, city: string) {
  const { data, error } = await supabase
    .rpc("get_events")
    .eq("city", city)
    .ilike("name", `%${name}%`);
  if (error) {
    console.error("Error searching events", error);
    throw error;
  }
  return sortEvents(data);
}

export async function getEventsByUser(userId: string) {
  const { data, error } = await supabase.from("events").select("*").eq("organiser", userId);
  if (error) {
    console.error("Error getting events by user", error);
    throw error;
  }
  return sortEvents(data);
}

export async function createEvent(details, user) {
  let fileUploadData = undefined;
  if (details.thumbnail) {
    const ext = details.thumbnail.split(".").pop();
    const fileName = `${getTsid()}.${ext}`;
    try {
      fileUploadData = await uploadFileToStorage(
        details.thumbnail,
        "thumbnails",
        fileName,
        "image/*"
      );
    } catch (error) {
      console.error("Error uploading thumbnail to storage", error);
      throw error;
    }
  }

  const startDateObject = toDateObject(details.startDate, details.startTime);
  const startDate = startDateObject.toISOString().split("T")[0];
  const startTime = startDateObject.toTimeString().split(" ")[0];

  const endDateObject = toDateObject(details.endDate, details.endTime);
  const endDate = endDateObject.toISOString().split("T")[0];
  const endTime = endDateObject.toTimeString().split(" ")[0];

  const { data, error } = await supabase.from("events").insert({
    name: details.eventName,
    description: details.description,
    city: details.city,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
    organiser: user?.id,
    location_name: details.locationName,
    location_url: details.locationUrl,
    thumbnail: details.thumbnail ? fileUploadData?.fullPath : null,
  });
  if (error) {
    console.error("Error creating event", error);
    throw error;
  }
  return data;
}

export async function updateEvent(eventId: string, update: any) {
  if (update.updatedThumbnail) {
    const { data, error } = await supabase.storage
      .from("thumbnails")
      .remove([update.thumbnail.split("/").pop()]);
    if (error) {
      console.error("Error deleting thumbnail from storage", error);
      throw error;
    }

    const ext = update.updatedThumbnail.split(".").pop();
    const fileName = `${getTsid()}.${ext}`;
    try {
      const fileUploadData = await uploadFileToStorage(
        update.updatedThumbnail,
        "thumbnails",
        fileName,
        "image/*"
      );
      update.thumbnail = fileUploadData.fullPath;
    } catch (error) {
      console.error("Error uploading thumbnail to storage", error);
      throw error;
    }
  }

  const startDateObject = toDateObject(update.startDate, update.startTime);
  const startDate = startDateObject.toISOString().split("T")[0];
  const startTime = startDateObject.toTimeString().split(" ")[0];

  const endDateObject = toDateObject(update.endDate, update.endTime);
  const endDate = endDateObject.toISOString().split("T")[0];
  const endTime = endDateObject.toTimeString().split(" ")[0];

  const { data, error } = await supabase
    .from("events")
    .update({
      name: update.eventName,
      description: update.description,
      city: update.city,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      location_name: update.locationName,
      location_url: update.locationUrl,
      thumbnail: update.thumbnail,
    })
    .eq("id", eventId);
  if (error) {
    console.error("Error updating event", error);
    throw error;
  }
  return data;
}
