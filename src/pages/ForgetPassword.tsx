import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
import { useDispatch } from "react-redux";

import { addEmail } from "../store/emailSlice";
import { Navigate } from "react-router-dom";

const ForgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
});

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/forgot-password", formData);
      return response;
    },
    onSuccess: (data) => {
      console.log("forgot-password success", data);
      if (data?.status == 200) {
        dispatch(addEmail(email));
        navigate("/confirmotp");
      }
    },
    onError: (error) => {
      console.log("forgot-password error", error);
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data Submitted email: ", data.email);
    setEmail(data.email);
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0 lg:p-6">
      <div className="w-full max-w-md p-2 lg:p-8 bg-white shadow-lg rounded-lg py-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mt-2 mb-6">
          Forget Password
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
                    Enter the email associated with your account, and we’ll send
                    you a reset link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
