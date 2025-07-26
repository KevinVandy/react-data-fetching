import { useMemo } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IUser } from "../api-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const UsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //load users
  const {
    data: users = [],
    isError: isErrorLoadingUser,
    isFetching: isFetchingUser,
    isPending: isPendingUser,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3300/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json() as Promise<IUser[]>;
    },
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

  return (
    <MantineReactTable
      data={users}
      columns={columns}
      state={{
        isPending: isPendingUser,
        showProgressBars: isFetchingUser,
        showAlertBanner: isErrorLoadingUser,
      }}
      mantineToolbarAlertBannerProps={
        isErrorLoadingUser
          ? {
              color: "red",
              children: "Error loading data",
            }
          : undefined
      }
      mantineTableBodyRowProps={({ row }) => ({
        onMouseEnter: () => {
          //same fetch as in UserPage.tsx
          queryClient.prefetchQuery({
            queryKey: ["users", row.original.id.toString()],
            queryFn: async () => {
              const response = await fetch(
                `http://localhost:3300/users/${row.original.id}`
              );
              if (!response.ok) {
                throw new Error("Failed to fetch user");
              }
              return response.json() as Promise<IUser>;
            },
          });
        },
        onClick: () => navigate(`/users/${row.original.id}`),
        style: {
          cursor: "pointer",
        },
      })}
    />
  );
};
