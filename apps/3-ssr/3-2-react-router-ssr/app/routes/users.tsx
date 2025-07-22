import { useMemo } from "react";
import { LoaderFunction, MetaFunction } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor, Alert, Stack, Title } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import type { IUser } from "../api-types";

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch(`http://localhost:3300/users`);
    const initialUsers = await response.json();

    return {
      initialUsers,
      error: false,
    };
  } catch (error) {
    console.error(error);

    return {
      initialUsers: null,
      error: true,
    };
  }
};

interface IUsersPageProps {
  initialUsers: IUser[];
  error: boolean;
}

export const meta: MetaFunction = () => {
  return [{ title: "Users - React Router SSR" }];
};

export default function UsersPage() {
  const { initialUsers, error: pageError } = useLoaderData<IUsersPageProps>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Load users - with initial data from SSR
  const {
    data: users = [],
    isError: isErrorLoadingUsers,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3300/users`);
      return response.json() as Promise<IUser[]>;
    },
    initialData: initialUsers, // SSR, with refresh
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
    []
  );

  const debouncedPrefetchUser = useDebouncedCallback(
    (userId: number) =>
      queryClient.prefetchQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
          const response = await fetch(`http://localhost:3300/users/${userId}`);
          return response.json() as Promise<IUser>;
        },
      }),
    100
  );

  if (pageError) {
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
        data={users}
        columns={columns}
        state={{
          showProgressBars: isFetchingUsers,
        }}
        mantineTableBodyRowProps={({ row }) => ({
          onMouseEnter: () => debouncedPrefetchUser(row.original.id),
          onClick: () => navigate(`/users/${row.original.id}`),
          style: {
            cursor: "pointer",
          },
        })}
      />
    </Stack>
  );
}
