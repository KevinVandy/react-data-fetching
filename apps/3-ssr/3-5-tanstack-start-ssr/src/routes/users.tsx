import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IUser } from "../api-types";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { usersQueryOptions, userQueryOptions } from "../queries/users";

export const Route = createFileRoute("/users")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
  component: UsersPage,
});

function UsersPage() {
  const navigate = useNavigate({ from: "/users" });
  const queryClient = useQueryClient();

  // Data is already loaded by the route loader, so this will resolve immediately
  const { data: users = [], isFetching: isFetchingUser } =
    useSuspenseQuery(usersQueryOptions);

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
    (userId: number) => queryClient.prefetchQuery(userQueryOptions(userId)),
    100,
  );

  return (
    <MantineReactTable
      data={users}
      columns={columns}
      state={{
        showProgressBars: isFetchingUser,
      }}
      mantineTableBodyRowProps={({ row }) => ({
        onMouseEnter: () => debouncedPrefetchUser(row.original.id),
        onClick: () =>
          navigate({
            to: "/users/$id",
            params: { id: row.original.id.toString() },
          }),
        style: {
          cursor: "pointer",
        },
      })}
    />
  );
}
