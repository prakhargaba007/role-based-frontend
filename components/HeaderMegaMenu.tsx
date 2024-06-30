"use client";
import React, { useEffect } from "react";
import {
  Group,
  Button,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./HeaderMegaMenu.module.css";
import Link from "next/link";

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const theme = useMantineTheme();

  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("userId") &&
    localStorage.getItem("token");
  // console.log(isLoggedIn);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const isLoggedIn =
  //       localStorage.getItem("userId") && localStorage.getItem("token");
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return <Button onClick={handleLogout}>Log out</Button>;
    } else {
      return (
        <>
          <Link href="/user/login">
            <Button variant="default">Log in</Button>
          </Link>{" "}
          <Link href="/user/signup">
            <Button>Sign up</Button>
          </Link>
        </>
      );
    }
  };

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/">
            <MantineLogo size={30} />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
          </Group>

          <Group visibleFrom="sm">{renderAuthButtons()}</Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Group justify="center" grow pb="xl" px="md">
            {renderAuthButtons()}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
