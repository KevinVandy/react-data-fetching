import { Anchor, AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconUsersGroup } from "@tabler/icons-react";
import ReactProviders from "./ReactProviders";

interface AppLayoutProps {
  children: React.ReactNode;
}

const links = [
  {
    icon: <IconHome size="1rem" />,
    color: "blue",
    label: "Home Feed",
    href: "/",
  },
  {
    icon: <IconUsersGroup size="1rem" />,
    color: "teal",
    label: "Users",
    href: "/users",
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <ReactProviders>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="xl"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} size="sm" />
            Astro React SSG
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          {links.map((link) => (
            <Anchor component={"a"} key={link.label} href={link.href}>
              {link.label}
            </Anchor>
          ))}
        </AppShell.Navbar>
        <AppShell.Main maw={1800} mx="auto">
          {children}
        </AppShell.Main>
      </AppShell>
    </ReactProviders>
  );
}
