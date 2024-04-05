"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  useMutationWithAuth,
  useQueryWithAuth,
} from "@convex-dev/convex-lucia-auth/react";
import {
  CaretSortIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { FaDiscord, FaGlobe, FaTelegram, FaXTwitter } from "react-icons/fa6";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";
import MainLayout from "@acme/ui/src/components/layout/main";
import { Button } from "@acme/ui/src/components/ui/button";
import { Checkbox } from "@acme/ui/src/components/ui/checkbox";
import { DataTable } from "@acme/ui/src/components/ui/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/src/components/ui/dropdown-menu";
import { Input } from "@acme/ui/src/components/ui/input";
import { Label } from "@acme/ui/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/src/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@acme/ui/src/components/ui/toggle-group";

type TaskType = Doc<"tasks">;
type Network = "twitter" | "discord" | "telegram" | "website";
type ActionType = "follow" | "post" | "join" | "visit";

export default function Tasks() {
  const tasks = useQueryWithAuth(api.adminQueries.fetchTasks, {});
  const deleteTask = useMutationWithAuth(api.adminMutations.deleteTaskWithId);
  const addTask = useMutationWithAuth(api.adminMutations.addTask);

  // Add task state
  const [name, setName] = useState("");
  const [reward, setReward] = useState(0);
  const [network, setNetwork] = useState<Network>("twitter");
  const [actionType, setActionType] = useState<ActionType>("follow");
  const [link, setLink] = useState("");

  // Editable modal open state
  const [open, setOpen] = useState<boolean>(false);
  const [editableTask, setEditableTask] = useState<Doc<"tasks"> | null>(null);

  useEffect(() => {
    if (editableTask) {
      setOpen(true);
    }
  }, [editableTask]);

  const columns: ColumnDef<TaskType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => {
        const reward: number = row.getValue("reward");
        return (
          <div className="uppercase">XP {reward.toLocaleString("en-US")}</div>
        );
      },
    },
    {
      accessorKey: "socialNetwork",
      header: "Social Network",
      cell: ({ row }) => {
        // const action = row.getValue("action");
        const task = row.original;
        const action = task.action;

        const getIcon = (social: string) => {
          switch (social) {
            case "twitter":
              return <FaXTwitter className="h-4 w-4" />;
            case "discord":
              return <FaDiscord className="h-4 w-4" />;
            case "telegram":
              return <FaTelegram className="h-4 w-4" />;
            case "website":
              return <FaGlobe className="h-4 w-4" />;
            default:
              return <FaGlobe className="h-4 w-4" />;
          }
        };

        return (
          <div className="flex items-center gap-2 lowercase">
            {getIcon(action?.channel)}
            {action?.channel}
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="mb-1 hover:cursor-pointer"
                  onClick={() => {
                    // setEditableTaskIndex(row.index);
                    setEditableTask(task);
                  }}
                >
                  Edit task
                </DropdownMenuItem>

                {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
                <DropdownMenuItem
                  className="bg-red-500 hover:cursor-pointer"
                  onClick={async () => {
                    await deleteTask({ taskId: task._id });
                  }}
                >
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className="mt-5 flex w-full flex-col gap-8">
        <div className="h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of all tasks that will show up in the mobile
                app
              </p>
            </div>
          </div>
          <DataTable
            filterVisible={false}
            data={tasks ?? []}
            columns={columns}
            extra={
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <PlusIcon className="h-4 w-4 font-bold" /> Add task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Create a new task</DialogTitle>
                  <div className="grid w-full items-center justify-start gap-2">
                    <div>
                      <Label htmlFor="task_name">Task Name</Label>
                      <Input
                        name="task_name"
                        id="task_name"
                        placeholder="Task name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward">Reward</Label>
                      <Input
                        name="reward"
                        id="reward"
                        type="number"
                        placeholder="Reward"
                        value={reward}
                        onChange={(event) =>
                          setReward(event.target.valueAsNumber)
                        }
                        className="max-w-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socials">Social Network</Label>
                      <ToggleGroup
                        id="socials"
                        type="single"
                        className="justify-start"
                        defaultValue={network}
                        value={network}
                        onValueChange={(value: Network) => {
                          setNetwork(value);
                          switch (value) {
                            case "twitter" as Network:
                              setActionType("follow");
                              break;
                            case "discord" as Network:
                            case "telegram" as Network:
                              setActionType("join");
                              break;
                            case "website" as Network:
                              setActionType("visit");
                              break;
                            default:
                              setActionType("follow");
                              break;
                          }
                        }}
                      >
                        <ToggleGroupItem
                          value="twitter"
                          aria-label="Toggle twitter"
                        >
                          <FaXTwitter className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="discord"
                          aria-label="Toggle discord"
                        >
                          <FaDiscord className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="telegram"
                          aria-label="Toggle telegram"
                        >
                          <FaTelegram className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="website"
                          aria-label="Toggle website"
                        >
                          <FaGlobe className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div>
                      <Label htmlFor="type">Select action type</Label>
                      <Select
                        name="type"
                        value={actionType}
                        onValueChange={(value: ActionType) =>
                          setActionType(value)
                        }
                      >
                        <SelectTrigger className="max-w-sm">
                          <SelectValue placeholder="Select a action type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            {network === "twitter" && (
                              <SelectItem value="follow">Follow</SelectItem>
                            )}
                            {network === "twitter" && (
                              <SelectItem value="post">Post</SelectItem>
                            )}
                            {(network === "discord" ||
                              network === "telegram") && (
                              <SelectItem value="join">Join</SelectItem>
                            )}
                            {network === "website" && (
                              <SelectItem value="visit">Visit</SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="link">
                        {network === "twitter" && actionType === "follow"
                          ? "Account username"
                          : network === "twitter" && actionType === "post"
                            ? "Post Id"
                            : "Link"}
                      </Label>
                      <Input
                        name="link"
                        id="link"
                        placeholder={
                          network === "twitter" && actionType === "follow"
                            ? "Account username"
                            : network === "twitter" && actionType === "post"
                              ? "Post Id"
                              : `${network} Link`
                        }
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          await addTask({
                            name,
                            reward,
                            action: {
                              channel: network,
                              link,
                              type: actionType,
                            },
                          });
                        }}
                      >
                        Create
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            }
          />
        </div>
        <EditableTaskDialog
          open={open}
          task={editableTask}
          onOpenChange={(open) => setOpen(open)}
        />
      </div>
    </MainLayout>
  );
}

interface IEditableTaskProps {
  task: Doc<"tasks"> | undefined | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function EditableTaskDialog({ task, open, onOpenChange }: IEditableTaskProps) {
  // Add task state
  const [nameEditable, setEditableName] = useState("");
  const [rewardEditable, setEditableReward] = useState(0);
  const [networkEditable, setEditableNetwork] = useState<Network>("twitter");
  const [actionTypeEditable, setEditableActionType] =
    useState<ActionType>("follow");
  const [linkEditable, setEditableLink] = useState("");

  const updateTask = useMutationWithAuth(api.adminMutations.updateTask);

  useEffect(() => {
    if (task) {
      setEditableName(task?.name);
      setEditableReward(task?.reward);
      setEditableNetwork(task?.action?.channel);
      setEditableActionType(task?.action?.type);
      setEditableLink(task?.action?.link);
    }
  }, [task]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={task?._id}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent>
        <DialogTitle>Edit task</DialogTitle>
        <div className="grid w-full items-center justify-start gap-2">
          <div>
            <Label htmlFor="task_name">Task Name</Label>
            <Input
              name="task_name"
              id="task_name"
              placeholder="Task name"
              value={nameEditable}
              onChange={(event) => setEditableName(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="reward">Reward</Label>
            <Input
              name="reward"
              id="reward"
              type="number"
              placeholder="Reward"
              value={rewardEditable}
              onChange={(event) =>
                setEditableReward(event.target.valueAsNumber)
              }
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="socials">Social Network</Label>
            <ToggleGroup
              id="socials"
              type="single"
              className="justify-start"
              defaultValue={networkEditable}
              value={networkEditable}
              onValueChange={(value: Network) => {
                setEditableNetwork(value);
                switch (value) {
                  case "twitter":
                    setEditableActionType("follow");
                    break;
                  case "discord":
                  case "telegram":
                    setEditableActionType("join");
                    break;
                  case "website":
                    setEditableActionType("visit");
                    break;
                  default:
                    setEditableActionType("follow");
                    break;
                }
              }}
            >
              <ToggleGroupItem value="twitter" aria-label="Toggle twitter">
                <FaXTwitter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="discord" aria-label="Toggle discord">
                <FaDiscord className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="telegram" aria-label="Toggle telegram">
                <FaTelegram className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="website" aria-label="Toggle website">
                <FaGlobe className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <Label htmlFor="type">Select action type</Label>
            <Select
              name="type"
              value={actionTypeEditable}
              onValueChange={(value: ActionType) =>
                setEditableActionType(value)
              }
            >
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Select a action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {networkEditable === "twitter" && (
                    <SelectItem value="follow">Follow</SelectItem>
                  )}
                  {networkEditable === "twitter" && (
                    <SelectItem value="post">Post</SelectItem>
                  )}
                  {(networkEditable === "discord" ||
                    networkEditable === "telegram") && (
                    <SelectItem value="join">Join</SelectItem>
                  )}
                  {networkEditable === "website" && (
                    <SelectItem value="visit">Visit</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="link">
              {networkEditable === "twitter" && actionTypeEditable === "follow"
                ? "Account username"
                : networkEditable === "twitter" && actionTypeEditable === "post"
                  ? "Post Id"
                  : "Link"}
            </Label>
            <Input
              name="link"
              id="link"
              placeholder={
                networkEditable === "twitter" && actionTypeEditable === "follow"
                  ? "Account username"
                  : networkEditable === "twitter" &&
                      actionTypeEditable === "post"
                    ? "Post Id"
                    : `${networkEditable} Link`
              }
              value={linkEditable}
              onChange={(event) => setEditableLink(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                await updateTask({
                  taskId: task?._id as Id<"tasks">,
                  name: nameEditable,
                  reward: rewardEditable,
                  action: {
                    channel: networkEditable,
                    link: linkEditable,
                    type: actionTypeEditable,
                  },
                });
              }}
            >
              Update
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
