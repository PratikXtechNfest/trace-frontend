import React from "react";
import { axiosInstance } from "../utils/axiosInstance";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Define the validation schema for the signup form
const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").trim(),
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
  referral: z.string().trim(),
  role: z.string().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase, lowercase, number, and special character",
      }
    ),
});

const Signup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      referral: "",
      role: "",
    },
  });

  const currentEmail = useSelector((state) => state?.email?.email);
  console.log(currentEmail, "current email");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/signup", formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("signup success", data);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const onSubmit = (data) => {
    console.log("Signup data submitted:", data);
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-0 lg:p-6">
      <div className="w-full max-w-md p-2 lg:p-8 bg-white shadow-lg rounded-lg py-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mt-2 mb-6">
          Create Your Account
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 lg:space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      type="text"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Your full name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Enter a valid email to receive updates.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Your password must be strong and secure.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">
                    referral_code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter referral_code"
                      type="text"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Referral_Code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700 font-semibold">
                    Role
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Role"
                      type="text"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Enter your Role
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              {mutation.isPending ? (
                <LoaderPinwheel className="mr-2 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-2 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/login" className="text-blue-500 ml-1">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
