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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./AuthenticationTitle.module.css";

interface FormValues {
  email: string;
  password: string;
}

export function AuthenticationTitlee() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 6 ? null : "Password must be at least 7 characters",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        if (data.token && data.userId) {
          // Store the token and user ID in local storage
          setMessage("Login successful!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          window.location.href = "/";
        } else {
          setMessage(data.error || "Login failed");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
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
          <Group mt="lg">
            <Anchor
              component="button"
              size="sm"
              style={{ marginRight: "auto" }}
            >
              Forgot password?
            </Anchor>
          </Group>

          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
          {message && (
            <Notification
              mt="md"
              onClose={() => setMessage(null)}
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
