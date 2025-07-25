import {
  Anchor,
  AppShell,
  Breadcrumbs,
  Burger,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconUsersGroup } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryOptions } from "./queries/users";
import { postsQueryOptions } from "./queries/posts";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const queryClient = useQueryClient();

  const links = [
    {
      icon: <IconHome size="1rem" />,
      color: "blue",
      label: "Home Feed",
      href: "/",
      prefetch: () => queryClient.prefetchQuery(postsQueryOptions),
    },
    {
      icon: <IconUsersGroup size="1rem" />,
      color: "teal",
      label: "Users",
      href: "/users",
      prefetch: () => queryClient.prefetchQuery(usersQueryOptions),
    },
  ];

  const breadCrumbLinks = useMemo(() => {
    const routes = pathname.split("/");
    routes.shift();
    const links: string[] = [];
    for (let i = 0; i < routes.length + 1; i++) {
      if (routes[i] && routes[i] !== "/")
        if (routes[i] === "posts") {
          links.push(`/`);
        } else links.push(`/${routes.slice(0, i + 1).join("/")}`);
    }
    return links;
  }, [pathname]);

  if (breadCrumbLinks.length === 1) {
    breadCrumbLinks.unshift("/");
  }

  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="xl"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          TanStack Start SSR
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {links.map((link) => (
          <Anchor
            onMouseEnter={link.prefetch}
            component={Link}
            key={link.label}
            to={link.href}
          >
            {link.label}
          </Anchor>
        ))}
      </AppShell.Navbar>
      <AppShell.Main mb="xl">
        <Stack gap="md" mt="lg">
          <Breadcrumbs aria-label="breadcrumb" pb="md">
            {breadCrumbLinks.map((link, index) => (
              <Anchor
                c="inherit"
                component={Link}
                key={index}
                td="none"
                to={link}
                tt="capitalize"
                style={{
                  cursor: "pointer",
                }}
              >
                {link === "/" ? "Home Feed" : link.split("/").pop()}
              </Anchor>
            ))}
          </Breadcrumbs>
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
