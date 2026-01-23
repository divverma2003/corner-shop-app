import { Inngest } from "inngest";
import { connectDB } from "../config/db.js";

import { User } from "../models/user.model.js";

// Create an Inngest client to send and receive events
export const inngest = new Inngest({
  name: "My App Inngest Client",
  id: "corner-shop-app",
});

// Every time a new user is created in Clerk, sync them to our database
const syncUser = inngest.createFunction(
  {
    id: "sync-user-to-db",
    name: "Sync New User",
    description: "Sync new users to the database from Clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const {
      email_addresses,
      id: clerkId,
      first_name,
      last_name,
      image_url,
    } = event.data;

    const email = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ").trim();

    const newUser = {
      clerkId,
      email: email || null,
      name: name || "User",
      imageUrl: typeof image_url !== "undefined" ? image_url || null : null,
      addresses: [],
      wishlist: [],
    };
    // TODO: send welcome email to user

    await User.findOneAndUpdate(
      { clerkId },
      { $setOnInsert: newUser },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },
);
const updateUserInDB = inngest.createFunction(
  {
    id: "update-user-in-db",
    name: "Update User",
    description: "Update user in the database when updated in Clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();
    const {
      email_addresses,
      id: clerkId,
      first_name,
      last_name,
      image_url,
    } = event.data;

    const update = {};

    const email = email_addresses[0]?.email_address;
    if (email) update.email = email;

    const name = [first_name, last_name].filter(Boolean).join(" ").trim();
    if (name) update.name = name;

    if (typeof image_url !== "undefined") update.imageUrl = image_url || null;

    // If no fields to update, return
    if (Object.keys(update).length === 0) return;

    await User.findOneAndUpdate({ clerkId }, { $set: update }, { new: true });
  },
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    name: "Delete User",
    description: "Delete user from the database when deleted from Clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id: clerkId } = event.data;
    await User.findOneAndDelete({ clerkId });
  },
);
// create an array of event listeners
export const functions = [syncUser, deleteUserFromDB, updateUserInDB];
