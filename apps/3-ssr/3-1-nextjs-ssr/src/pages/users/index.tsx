import { GetServerSideProps } from "next";
import { Alert, Stack, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor } from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { type IUser } from "../../api-types";

//Load users on server side for SEO
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const fetchUrl = new URL(`http://localhost:3300/users`);
    const response = await fetch(fetchUrl.href);
    const fetchedUsers = (await response.json()) as IUser[];

    return {
      props: {
        users: fetchedUsers,
        error: false,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        users: [],
        error: true,
      },
    };
  }
};

interface UsersPageProps {
  users: IUser[];
  error: boolean;
}

export default function UsersPage({ users, error }: UsersPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Load users - with initial data from SSR
  const {
    data: usersData = [],
    isError: isErrorLoadingUsers,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3300/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json() as Promise<IUser[]>;
    },
    initialData: users, // SSR, with refresh
  });

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "website",
        header: "Website",
        Cell: ({ cell, renderedCellValue }) => (
          <Anchor
            onClick={(e) => e.stopPropagation()}
            href={`https://${cell.getValue<string>()}`}
            target="_blank"
          >
            {renderedCellValue}
          </Anchor>
        ),
      },
    ],
    [],
  );

  const debouncedPrefetchUser = useDebouncedCallback(
    (userId: number) =>
      queryClient.prefetchQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
          const response = await fetch(`http://localhost:3300/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          return response.json() as Promise<IUser>;
        },
      }),
    100,
  );

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        There was an error loading this page
      </Alert>
    );
  }

  if (isErrorLoadingUsers) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        There was an error loading users
      </Alert>
    );
  }

  return (
    <Stack>
      <Title order={1}>Users</Title>
      <MantineReactTable
        data={usersData}
        columns={columns}
        state={{
          showProgressBars: isFetchingUsers,
        }}
        mantineTableBodyRowProps={({ row }) => ({
          onMouseEnter: () => debouncedPrefetchUser(row.original.id),
          onClick: () => router.push(`/users/${row.original.id}`),
          style: {
            cursor: "pointer",
          },
        })}
      />
    </Stack>
  );
}
