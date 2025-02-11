import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IUser } from "../api-types";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchUser } from "../hooks/useGetUser";
import { useGetUsers } from "../hooks/useGetUsers";

export const UsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //load users
  const {
    data: users = [],
    isError: isErrorLoadingUser,
    isFetching: isFetchingUser,
    isLoading: isLoadingUser,
  } = useGetUsers();

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
    (userId: number) => prefetchUser(queryClient, userId),
    100,
  );

  return (
    <MantineReactTable
      data={users}
      columns={columns}
      state={{
        isLoading: isLoadingUser,
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
        onMouseEnter: () => debouncedPrefetchUser(row.original.id),
        onClick: () => navigate(`/users/${row.original.id}`),
        style: {
          cursor: "pointer",
        },
      })}
    />
  );
};
