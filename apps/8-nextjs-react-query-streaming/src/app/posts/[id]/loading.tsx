"use client";

import { Loader, Stack } from "@mantine/core";

export default function Loading() {
  return (
    <Stack m="auto" mih={200} justify="center" align="center">
      <Loader />
    </Stack>
  );
}
