// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import type { Metadata } from "next";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { HeaderMegaMenu } from "@/components/HeaderMegaMenu";

export const metadata: Metadata = {
  title: "Notes App",
  description:
    "It is an intuitive and powerful note-taking app designed to help you capture and organize your thoughts, ideas, and important information effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <HeaderMegaMenu />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
