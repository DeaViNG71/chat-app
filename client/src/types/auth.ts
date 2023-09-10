import { z } from "zod";
import { credentialSchema, signupSchema } from "@/lib/schemas";
import { Channel, FriendRequest, Member, User } from ".";

export type LoginCredentials = z.infer<typeof credentialSchema>;

export type SignupForm = z.infer<typeof signupSchema>;

export type SessionStatus = "authenticated" | "unauthenticated" | "loading";

export type Session = {
  status: SessionStatus;
  /** interval time in milli-seconds */
  expiresIn?: number;
} | null;

export type UserProfileInfo = User & {
  friends: User[];
  friendRequestSent: FriendRequest[];
  friendRequestReceived: FriendRequest[];
  member: { id: string; channels: Channel[] };
  channels: Channel[];
};

export type LoginResponse = {
  message: string;
  data: UserProfileInfo;
};

export type SignInOptions = {
  redirectPath?: string;
};