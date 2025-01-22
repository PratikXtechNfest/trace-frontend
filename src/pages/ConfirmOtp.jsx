import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ConfirmOTPSchema = z.object({
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const ConfirmOTP = () => {
  const navigate = useNavigate();
  let email = "";
  const userEmail = useSelector((state) => state?.email?.email);
  const user = useSelector((state) => state?.user?.user);

  console.log("user", user);

  if (userEmail) {
    email = userEmail;
  }

  const form = useForm({
    resolver: zodResolver(ConfirmOTPSchema),
    defaultValues: {
      email: email,
      otp: "",
      newPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/reset-password", formData);
      return response;
    },
    onSuccess: (data) => {
      console.log("OTP confirmed and password reset success", data);
      alert("Your password has been reset successfully!");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Failed to reset password:", error);
      alert("Failed to reset password. Please try again.");
    },
  });

  const isUsedPassword = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/check-used-password", data);
      return response;
    },
    onSuccess: (data) => {
      console.log("Password already used", data);
      alert("Password already used. Please choose a different password.");
    },
    onError: (error) => {
      console.error("Failed to check password:", error);
      alert("Failed to check password. Please try again.");
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data Submitted: ", data);
    mutation.mutate(data);

    isUsedPassword.mutate({
      newPassword: data.newPassword,
      email: data.email,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0 lg:p-6">
      <div className="w-full max-w-md p-2 lg:p-8 bg-white shadow-lg rounded-lg py-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mt-2 mb-6">
          Confirm OTP
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 lg:space-y-6"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Enter the email associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* OTP Field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the OTP sent to your email"
                      type="text"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Enter the 6-digit OTP sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your new password"
                      type="password"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Create a strong password for your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              Confirm OTP and Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default ConfirmOTP;
