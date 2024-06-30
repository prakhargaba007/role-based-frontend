"use client";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Notification,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./AuthenticationTitle.module.css";
import { useRouter } from "next/navigation";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export function AuthenticationTitle() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user", // Default role
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      role: (value) =>
        ["user", "admin", "delivery boy"].includes(value)
          ? null
          : "Invalid role",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email.toLowerCase(),
            password: values.password,
            role: values.role,
          }),
        }
      );

      if (response.ok) {
        setMessage("Sign up successful!");
        setTimeout(() => {
          router.push("/user/login");
        }, 1500);
      } else {
        setMessage("Sign up failed. Please try again.");
      }
    } catch (error) {
      setMessage("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component="button">
          Log In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Select
            label="Role"
            placeholder="Select your role"
            data={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
              { value: "delivery boy", label: "Delivery Boy" },
            ]}
            required
            mt="md"
            {...form.getInputProps("role")}
          />
          <Group justify="space-between" mt="lg">
            <p></p>
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </Button>
          {message && (
            <Notification
              mt="md"
              color={message.includes("successful") ? "teal" : "red"}
            >
              {message}
            </Notification>
          )}
        </form>
      </Paper>
    </Container>
  );
}
