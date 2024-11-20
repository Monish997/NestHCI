import { getUserProfile } from "@/api/users";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { NestEvent } from "@/types";

export async function setAuthUserFromSession(
  session: Session | null,
  setAuthUser: (arg0: any) => void
) {
  if (session?.user) {
    setAuthUser(session?.user);
    const profile = await getUserProfile(session.user.id);
    setAuthUser({ ...session.user, ...profile });
  } else {
    setAuthUser(null);
  }
}

export async function uploadFileToStorage(
  uri: string,
  bucketName: string,
  fileName: string,
  contentType?: string
) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const arrayBuffer = decode(base64);
  const { data, error } = await supabase.storage.from(bucketName).upload(fileName, arrayBuffer, {
    upsert: true,
    contentType,
  });
  if (error) {
    throw error;
  }
  return data;
}

export function convertTimeFormat(timeString: string, includeSeconds = false) {
  // from 17:30:00 to 5:00 PM
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
  });
}

export function convertDateFormat(dateString: string) {
  // from 2021-12-31 to 31/12/2021
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day}/${month}/${year}`;
}

export function toDateObject(dateString: string, timeString: string) {
  const [day, month, year] = dateString.split("/").map(Number);
  const [time, ampm] = timeString.replace(" ", " ").split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);
  seconds = seconds || 0;

  if (ampm.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (ampm.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export function sortEvents(events: NestEvent[]) {
  return events.sort((a, b) => {
    const aDate = toDateObject(convertDateFormat(a.start_date), convertTimeFormat(a.start_time));
    const bDate = toDateObject(convertDateFormat(b.start_date), convertTimeFormat(b.start_time));
    return aDate.getTime() - bDate.getTime();
  });
}
