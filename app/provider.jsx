"use client";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";

const Provider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = () => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      // checking if the user already exist
      let { data: Users, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email);
      console.log(Users);

      if (Users?.length == 0) {
        const { data, error } = await supabase.from("users").insert([
          {
            name: user?.user_metadata?.name,
            email: user?.email,
            picture: user?.user_metadata?.picture,
          },
        ]);
        console.log("New user created:", data);
        setUser(data);
        return;
      }
      setUser(Users[0]);
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserContext.Provider>
  );
};

export default Provider;

export const useUser = () => {
  const context = useContext(UserContext);
return context;

}