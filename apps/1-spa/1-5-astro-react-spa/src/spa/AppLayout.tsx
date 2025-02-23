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
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const links = [
  {
    icon: <IconHome size="1rem" />,
    color: "blue",
    label: "Home Feed",
    href: "/spa",
  },
  {
    icon: <IconUsersGroup size="1rem" />,
    color: "teal",
    label: "Users",
    href: "/spa/users",
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();

  const breadCrumbLinks = useMemo(() => {
    const routes = pathname.split("/");
    routes.shift(); // Remove empty string from start
    const links: string[] = [];

    // Handle root /spa path
    if (routes.length === 1 && routes[0] === "spa") {
      links.push("/spa");
    } else {
      // Handle nested paths
      for (let i = 0; i < routes.length; i++) {
        if (routes[i] && routes[i] !== "spa") {
          if (routes[i] === "posts") {
            links.push("/spa");
          } else {
            // Skip "spa" in the path parts to avoid duplication
            const pathParts = routes
              .slice(1, i + 1)
              .filter((part) => part !== "spa");
            links.push(`/spa/${pathParts.join("/")}`);
          }
        }
      }
    }
    links.unshift("/");

    return links;
  }, [pathname]);

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
          Astro SPA with React Query
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {links.map((link) => (
          <Anchor component={Link} key={link.label} to={link.href}>
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
                component={link === "/" ? "a" : (Link as any)}
                key={index}
                td="none"
                to={link}
                href={link === "/" ? "/" : link}
                tt="capitalize"
                style={{
                  cursor: "pointer",
                }}
              >
                {link === "/"
                  ? "Home"
                  : link === "/spa"
                    ? "Posts Feed"
                    : link.split("/").pop()}
              </Anchor>
            ))}
          </Breadcrumbs>
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
