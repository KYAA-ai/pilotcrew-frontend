import cx from "classnames";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { fetcher, getTitleFromChat, generateUUID } from "@/lib/utils";
import apiClient from "@/lib/api";
import type { Chat, User } from "../../lib/utils";

import { PanelLeftIcon } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

import {
  Sheet,
  SheetContent
} from "../ui/sheet";
import {
  InfoIcon,
  PencilEditIcon,
  MoreHorizontalIcon,
} from "./icons";

export const History = ({ user, jobId }: { user: User | undefined, jobId: string }) => {
  const { id } = useParams();
  const pathname = useLocation();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(user ? `/v1/employee/getChatHistory` : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameChatId, setRenameChatId] = useState<string | null>(null);
  const [newChatName, setNewChatName] = useState("");

  const navigate = useNavigate();

  const [currentParams] = useSearchParams();
  const currentJobId = currentParams.get('jobId');
  const currentChatId = currentParams.get('chatId');

  const handleDelete = async () => {
    const deletePromise = apiClient.delete(`/v1/employee/chat/${deleteId}`);

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((h) => h.id !== deleteId);
          }
        });
        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);
  };

  const handleRename = async () => {
    const renamePromise = apiClient.put(`/v1/employee/chat/${renameChatId}/rename`, {
      title: newChatName
    });

    toast.promise(renamePromise, {
      loading: "Renaming chat...",
      success: () => {
        // Refresh the chat history
        mutate();
        setShowRenameDialog(false);
        setRenameChatId(null);
        setNewChatName("");
        return "Chat renamed successfully";
      },
      error: "Failed to rename chat",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="p-1.5 h-fit"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <PanelLeftIcon className="h-4 w-4" />
      </Button>

      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          {/* <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle className="text-left">History</SheetTitle>
              <SheetDescription className="text-left">
                {history === undefined ? "loading" : history.length} chats
              </SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader> */}

          <div className="text-sm flex flex-row items-center justify-between mb-4">
            <div className="flex flex-row gap-2">
              <div className="dark:text-zinc-300">History</div>

              <div className="dark:text-zinc-400 text-zinc-500">
                {history === undefined ? "loading" : history.length} chats
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            {user && (
              <Button
                className="font-normal text-sm flex flex-row justify-between text-white mb-4"
                asChild
                onClick={async () => {
                  const createChatPromise = (async () => {
                    const newChatId = generateUUID();
                    await apiClient.post("/v1/employee/updateChatHistory", {
                      id: newChatId,
                      messages: []
                    });
                    
                    // Navigate to the new chat
                    navigate(`/employee/workflow?jobId=${jobId}&chatId=${newChatId}`);
                    
                    // Refresh the history
                    mutate();
                  })();

                  toast.promise(createChatPromise, {
                    loading: "Creating new chat...",
                    success: "New chat created successfully",
                    error: "Failed to create new chat",
                  });
                }}
              >
                <span>
                  <div>Start a new chat</div>
                  <PencilEditIcon size={14} />
                </span>
              </Button>
            )}

            <div className="flex flex-col overflow-y-auto flex-1">
              {!isLoading && history?.length === 0 && user ? (
                <div className="text-zinc-500 h-full w-full flex flex-row justify-center items-center text-sm gap-2">
                  <InfoIcon />
                  <div>No chats found</div>
                </div>
              ) : null}

              {isLoading && user ? (
                <div className="flex flex-col space-y-2">
                  {[44, 32, 28, 52].map((item) => (
                    <div key={item} className="p-2">
                      <div
                        className={`w-${item} h-[20px] rounded-md bg-zinc-200 dark:bg-zinc-600 animate-pulse`}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {history &&
                history.map((chat) => (
                  <div
                    key={chat.id}
                    className={cx(
                      "flex flex-row items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md p-1 mb-1",
                      { "bg-zinc-200 dark:bg-zinc-700": chat.id === id },
                    )}
                  >
                    <Button
                      variant="ghost"
                      className={cx(
                        "hover:bg-zinc-200 dark:hover:bg-zinc-700 justify-between p-2 text-sm font-normal flex flex-row items-center gap-2 flex-1 transition-none text-ellipsis overflow-hidden text-left rounded-lg outline-zinc-900 truncate",
                      )}
                      asChild
                      onClick={() => {
                        if (currentJobId !== jobId || currentChatId !== chat.id) {
                          navigate(`/employee/workflow?jobId=${jobId}&chatId=${chat.id}`);
                        }
                      }}
                    >
                      <div>
                        {getTitleFromChat(chat)}
                      </div>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="p-2 h-fit font-normal text-zinc-500 transition-none hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          variant="ghost"
                        >
                          <MoreHorizontalIcon size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" className="z-[60]">
                        <DropdownMenuItem onClick={() => {
                          setRenameChatId(chat.id);
                          setNewChatName(getTitleFromChat(chat));
                          setShowRenameDialog(true);
                        }}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setDeleteId(chat.id);
                          setShowDeleteDialog(true);
                        }} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter new chat name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};