"use client";

import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  fullname: z.string().min(2).max(50),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User | null;
}

export default function AccountForm({ user }: ProfileFormProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user?.email || "",
      fullname: "",
      username: "",
    },
    mode: "onChange",
  });

  const getProfile = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("full_name, username")
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        });
        throw error;
      }

      if (data) {
        form.reset({
          ...form.getValues(),
          fullname: data.full_name || "",
          username: data.username || "",
        });
      }
    } catch (error) {
      console.error("Profile loading error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error loading user data",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [user, supabase, form]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Saving changes...",
      description: "Please wait while we update your profile.",
    });

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: data.fullname,
        username: data.username,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Username already taken",
            description: "Please choose a different username",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error updating profile",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        }
        return;
      }

      // Refresh the form data after successful update
      await getProfile();

      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                This is your verified email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your full name or display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || isInitialLoading}>
          {isLoading
            ? "Updating..."
            : isInitialLoading
              ? "Loading..."
              : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
