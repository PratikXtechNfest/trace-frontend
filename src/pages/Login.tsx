import React from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addUser } from "../store/userSlice";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
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
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/login", formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("signin success", data);

      queryClient.invalidateQueries(["authUser"]);

      navigate("/dashboard", { replace: true });

      // navigate("/dashboard");
      console.log("Navigated to dashboard"); // Should appear in console if navigation is executed.
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0 lg:p-6">
      <div className="w-full max-w-md p-2 lg:p-8 bg-white shadow-lg rounded-lg py-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mt-2 mb-6">
          Login
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 lg:space-y-6"
          >
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Your account password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me Checkbox */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      {...field}
                      id="rememberMe"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="rememberMe"
                    className="text-sm text-blue-700 font-medium"
                  >
                    Remember Me
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              {mutation.isPending ? (
                <LoaderPinwheel className="mr-2 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <Link to="/forget-password">
          <p className="text-sm text-gray-500 mt-4 hover:text-blue-700">
            Forgot Password?
          </p>
        </Link>

        <div className="mt-2 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <Link to="/signup" className="text-blue-500 ml-1">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
