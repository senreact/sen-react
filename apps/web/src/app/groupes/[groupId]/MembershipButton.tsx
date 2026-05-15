"use client";

import { useTransition } from "react";

import { joinGroupAction, leaveGroupAction } from "../actions";

interface Props {
  groupId: string;
  isMember: boolean;
}

export function MembershipButton({ groupId, isMember }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isMember) {
        await leaveGroupAction(groupId);
      } else {
        await joinGroupAction(groupId);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={
        isMember
          ? "rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-muted)] hover:border-red-400 hover:text-red-500 disabled:opacity-50"
          : "rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      }
    >
      {pending ? "…" : isMember ? "Quitter le groupe" : "Rejoindre"}
    </button>
  );
}
