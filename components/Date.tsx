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

interface Note {
  title: string;
  description: string;
  date: string;
}

interface DateProps {
  dataHandler: (note: Note) => void;
}

export default function Date({ dataHandler }: DateProps) {
  const [value, setValue] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  // const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state

  // useEffect(() => {
  //   setToken(localStorage.getItem("token"));
  // }, []);
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = () => {
    setLoading(true); // Set loading state to true when submitting

    const data = {
      title: title,
      description: description,
      date: value?.toDateString() || "",
    };

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/feed/note", {
      method: "POST",
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
        dataHandler(data.post);
        // Reset form values and state
        setTitle("");
        setDescription("");
        setValue(null);
        setAddingNote(false);
        setLoading(false); // Set loading state to false after successful submission
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
        setLoading(false); // Set loading state to false after error
      });
  };

  const handleCancel = () => {
    // Reset form values and state
    setTitle("");
    setDescription("");
    setValue(null);
    setAddingNote(false);
  };

  const handleAddNote = () => {
    // Set addingNote state to true to show the form
    setAddingNote(true);
  };

  return (
    <div className={classes.container}>
      {addingNote ? (
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
          <Button onClick={handleSubmit} variant="outline" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button onClick={handleCancel} variant="outline" disabled={loading}>
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={handleAddNote} variant="outline" disabled={loading}>
          {loading ? "Adding Note..." : "Add Note"}
        </Button>
      )}
    </div>
  );
}
