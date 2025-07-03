"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarOptions } from "@/constants/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const AppSidebar = () => {
  const path = usePathname();
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-center mb-4 mt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="size-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <path d="M12 18.58V22" />
                <path d="M8 22h8" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              AI
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                cruiter
              </span>
            </span>
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/create-interview")}
          className="w-full mb-4"
        >
          <Plus className="mr-2 w-full" />
          Create New Interview
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SidebarOptions.map((option, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`p-5 ${path == option.path && "bg-blue-50"}`}
                  >
                    <Link href={option.path}>
                      <option.icon
                        className={`${path == option.path && "text-primary"}`}
                      />
                      <span
                        className={`text-[16px] ${
                          path == option.path && "text-primary"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
