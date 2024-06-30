"use client";
import { Menu, Group, ActionIcon, rem, Modal, Button } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Date from "./Date copy";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  dataHandlers: (data: any) => void; // Adjust the type of data if possible
  params: string; // Adjust the type if `params` is not a string
}

export function UserMenu({ dataHandlers, params }: UserMenuProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  // let token = localStorage.getItem("token");
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // console.log(token);

  function dataHandler(data: any, isClose: boolean) {
    // Adjust the type of data if possible
    dataHandlers(data);
    if (isClose) {
      close();
    }
  }

  const deleteNote = async () => {
    try {
      // console.log(params);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/feed/note/${params}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete the note");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Note"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        transitionProps={{
          transition: "fade",
          duration: 200,
          timingFunction: "linear",
        }}
      >
        <Date params={params} dataHandler={dataHandler} />
      </Modal>
      <Group justify="center">
        <Menu
          withArrow
          width={300}
          position="bottom"
          transitionProps={{ transition: "pop" }}
          withinPortal
        >
          <Menu.Target>
            <ActionIcon variant="default">
              <IconDots
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item onClick={open}>Edit Note</Menu.Item>
            <Menu.Item color="red" onClick={deleteNote}>
              Delete Note
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
}
