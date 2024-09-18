import { useEffect, useMemo, useState } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IUser } from "../api-types";

export const UsersPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isErrorLoadingUser, setIsErrorLoadingUser] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const fetchUsers = async () => {
    if (!users.length) {
      setIsLoadingUser(true);
    }
    setIsFetchingUser(true);
    try {
      const fetchUrl = new URL(`http://localhost:3333/users`);
      const response = await fetch(fetchUrl.href);
      const newUsers = (await response.json()) as IUser[];
      setUsers(newUsers);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingUser(true);
    } finally {
      setIsLoadingUser(false);
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        onClick: () => navigate(`/users/${row.original.id}`),
        style: {
          cursor: "pointer",
        },
      })}
    />
  );
};
