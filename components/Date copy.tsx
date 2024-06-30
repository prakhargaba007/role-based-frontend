"use client";
import React, { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import {
  TextInput,
  Textarea,
  Tooltip,
  Center,
  Text,
  rem,
  Button,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import classes from "./Date.module.css";

// Define the prop types for TooltipIcon
interface TooltipIconProps {
  title: string;
  placeholder: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void; // Make onChange prop optional
}

// Define the prop types for Date component
interface DateProps {
  dataHandler: (note: any, status: boolean) => void;
  params: string;
}

function TooltipIcon({ title, placeholder, onChange }: TooltipIconProps) {
  const rightSection = (
    <Tooltip
      label="We store your data securely"
      position="top-end"
      withArrow
      transitionProps={{ transition: "pop-bottom-right" }}
    >
      <Text component="div" c="dimmed" style={{ cursor: "help" }}>
        <Center>
          <IconInfoCircle
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </Center>
      </Text>
    </Tooltip>
  );

  // Conditionally render TextInput or Textarea based on title
  const InputComponent = title === "Description" ? Textarea : TextInput;

  return (
    <InputComponent
      rightSection={rightSection}
      label={title}
      placeholder={placeholder}
      onChange={onChange} // Pass onChange prop to the input component
    />
  );
}

export default function Date({ dataHandler, params }: DateProps) {
  const [value, setValue] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   setToken(localStorage.getItem("token"));
  // }, []);
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = () => {
    const data = {
      title: title,
      description: description,
      date: value?.toDateString() || "",
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feed/note/${params}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit note");
        }
        return response.json();
      })
      .then((data) => {
        dataHandler(data.note, true);

        // Reset form values and state
        setTitle("");
        setDescription("");
        setValue(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  return (
    <div className={classes.container}>
      <>
        <TooltipIcon
          title="Title"
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)} // Pass onChange handler
        />
        <TooltipIcon
          title="Description"
          placeholder="Enter Description"
          onChange={(e) => setDescription(e.target.value)} // Pass onChange handler
        />
        <DatePickerInput
          label="Pick date"
          placeholder="Pick date"
          value={value}
          onChange={setValue}
        />
        <Button onClick={handleSubmit} variant="outline">
          Submit
        </Button>
      </>
    </div>
  );
}
