import { Button, Dropdown, DropdownItem } from "@/components/ui";
import { SelectedFriendId } from "@/lib/store";
import { CheckMark, XmarkRX } from "@/lib/utils/icons";
import { FriendRequestQueryResponse, User } from "@/types";
import Image from "next/image";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ButtonAction } from "..";
import { useSocket } from "@/context";
import { ack } from "@/lib/actions";

type Props = User & {
  requestType?: "incoming" | "outgoing";
  requestId?: string;
};

export default function FriendListItem({
  id,
  requestId,
  avatar,
  name,
  requestType,
}: Props) {
  const selectFriendProfile = useSetRecoilState(SelectedFriendId);
  const {
    socket,
    removeFriendRequestsSent,
    removeFriendRequestsReceived,
    appendFriend,
  } = useSocket();

  function cancelRequest(requestId?: string) {
    if (!requestId) {
      console.log("Friend request does not exist or have been deleted.");
      return;
    }

    socket?.emit(
      "friends:cancel-request",
      requestId,
      ack({
        onSuccess(data, message) {
          removeFriendRequestsSent(requestId);
          console.log(data);
          console.log(message);
        },
        onError(message) {
          console.error(message);
        },
      }),
    );
  }

  function approveRequest(requestId?: string) {
    if (!requestId) {
      console.log("Friend request does not exist or have been deleted.");
      return;
    }

    socket?.emit(
      "friends:accept-request",
      requestId,
      ack<FriendRequestQueryResponse>({
        onSuccess(data, message) {
          removeFriendRequestsReceived(requestId);
          appendFriend(data.sender);
        },
        onError(message) {
          console.error(message);
        },
      }),
    );
  }

  function declineRequest(requestId?: string) {
    if (!requestId) {
      console.log("Friend request does not exist or have been deleted.");
      return;
    }

    socket?.emit(
      "friends:decline-request",
      requestId,
      ack<FriendRequestQueryResponse>({
        onSuccess(data, message) {
          removeFriendRequestsReceived(requestId);
          console.log(message);
        },
        onError(message) {
          console.error(message);
        },
      }),
    );
  }

  useEffect(() => {
    return () => {
      selectFriendProfile("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li>
      <div
        className="group flex w-full items-center justify-between px-4 py-1 hover:bg-muted lg:px-8 lg:py-2"
        onClick={() => selectFriendProfile(id)}
      >
        <div className="flex items-center">
          <Image
            src={avatar}
            alt="Profile Avatar"
            width={36}
            height={36}
            className="mr-2 h-9 w-9 rounded-full object-contain"
          />
          <span className="font-medium">{name}</span>
        </div>
        {requestType === "outgoing" && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium capitalize tracking-tight text-foreground-secondary">
              {requestType} request
            </span>
            <ButtonAction tooltip="Cancel">
              <Button
                type="button"
                className="grid h-8 w-8 place-content-center bg-background hover:!bg-background"
                variant="circular"
                onClick={() => cancelRequest(requestId)}
              >
                <XmarkRX />
              </Button>
            </ButtonAction>
          </div>
        )}
        {requestType === "incoming" && (
          <div className="flex items-center gap-2">
            <ButtonAction tooltip="Decline">
              <Button
                type="button"
                className="grid h-8 w-8 place-content-center bg-background hover:!bg-background"
                variant="circular"
                onClick={() => declineRequest(requestId)}
              >
                <XmarkRX />
              </Button>
            </ButtonAction>
            <ButtonAction tooltip="Approve">
              <Button
                type="button"
                className="grid  h-8 w-8 place-content-center bg-background hover:!bg-background"
                variant="circular"
                onClick={() => approveRequest(requestId)}
              >
                <CheckMark />
              </Button>
            </ButtonAction>
          </div>
        )}
        {!requestType && (
          <Dropdown>
            <DropdownItem>
              <button className="w-full rounded-sm px-2 py-1 text-left hover:bg-muted">
                Send a message
              </button>
            </DropdownItem>
            <DropdownItem>
              <button className="w-full rounded-sm px-2 py-1 text-left hover:bg-muted">
                Remove friend
              </button>
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </li>
  );
}
