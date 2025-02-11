"use client";

import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Error() {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
      There was an error loading this post
    </Alert>
  );
}
