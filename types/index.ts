export type NestEvent = {
  id: string;
  name: string;
  created_at: string;
  city: string;
  thumbnail: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  organiser: UserProfile;
  location_name: string;
  location_url: string;
  num_interested?: number;
  num_going?: number;
};

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  profile_pic: string;
};
