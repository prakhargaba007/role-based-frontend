"use client";
import { Card, Text, Group, Badge, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./BadgeCard.module.css";
import { UserMenu } from "./UserMenu";

interface BadgeCardProps {
  params: string; // Adjust the type if `params` is not a string
}

interface NoteData {
  title: string;
  description: string;
  date: string;
}

// Utility function to format the date
const formatDate = (dateString: string) => {
  if (!dateString) {
    return "Invalid date"; // Handle empty or undefined date strings
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date"; // Handle invalid date objects
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export function BadgeCard({ params }: BadgeCardProps) {
  const theme = useMantineTheme();
  const [data, setData] = useState<NoteData>({
    title: "",
    description: "",
    date: "",
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch the token on the client side
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Only fetch data if token is available
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feed/note/${params}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data.note);
          // console.log(data.note);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [params, token]);

  function dataHandlers(data: NoteData) {
    // console.log(data);
    setData(data);
  }

  const { title, description, date } = data;

  return (
    <div className={classes.container}>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="lg" fw={500}>
              {title}
            </Text>
            <Badge size="sm" variant="light">
              {formatDate(date)}
            </Badge>
            <UserMenu dataHandlers={dataHandlers} params={params} />
          </Group>
          <Text fz="sm" mt="xs">
            {description}
          </Text>
        </Card.Section>
      </Card>
    </div>
  );
}
