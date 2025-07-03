"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return {
    userData: context.userData,
    userLoading: context.userLoading,
    fetchUserData: context.fetchUserData,
    updateUserData: context.updateUserData,
    getUserById: context.getUserById,
    getAllUsers: context.getAllUsers,
    refreshUserData: context.refreshUserData,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      // Create user in database if new login
      if (event === "SIGNED_IN" && session?.user) {
        await createNewUser(session.user);
        await fetchUserData(session.user.email);
      } else if (event === "SIGNED_OUT") {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createNewUser = async (user) => {
    try {
      // Check if user already exists using auth_id
      const { data: existingUsers, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email);

      if (selectError) {
        console.error("Error checking existing user:", selectError);
        return;
      }

      // If user doesn't exist, create new user
      if (existingUsers?.length === 0) {
        const { data, error } = await supabase
          .from("users")
          .insert([
            {
              name: user.user_metadata?.name,
              email: user.email,
              picture: user.user_metadata?.picture,
            },
          ])
          .select(); // Add this to return the inserted data

        if (error) {
          console.error("Error creating new user:", error);
        } else {
          console.log("New user created:", data);
        }
      }
    } catch (error) {
      console.error("Error in createNewUser:", error);
    }
  };

  // Fetch user data from database
  const fetchUserData = async (email) => {
    try {
      setUserLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return null;
      }

      setUserData(data);
      return data;
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  // Update user data in database
  const updateUserData = async (updates) => {
    if (!userData) {
      console.error("No user data available to update");
      return null;
    }

    try {
      setUserLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userData.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user data:", error);
        return null;
      }

      setUserData(data);
      console.log("User data updated:", data);
      return data;
    } catch (error) {
      console.error("Error in updateUserData:", error);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user by ID:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserById:", error);
      return null;
    }
  };

  // Get all users (for admin purposes)
  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all users:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return [];
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user?.email) {
      await fetchUserData(user.email);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "/",
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    // Auth related
    user,
    setUser,
    loading,
    signInWithGoogle,
    signOut,

    // User data related
    userData,
    userLoading,
    fetchUserData,
    updateUserData,
    getUserById,
    getAllUsers,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
