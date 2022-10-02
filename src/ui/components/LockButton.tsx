import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { makeClickable } from "../services/a11y";
import { IconButton } from "./IconButton";
import { LockIcon } from "./Icons/MuiIcons";
import { stopSession } from "../services/backgroundSessions";

interface BackButtonProps {
  to?: string;
}

export const LockButton: FC<BackButtonProps> = (props) => {
  const navigate = useNavigate();
  const onClick = () => (props.to ? navigate(props.to) : stopSession());

  return (
    <IconButton
      {...makeClickable(onClick, { label: "Back", tabIndex: 99 })}
      size={36}
      {...props}
    >
      <LockIcon />
    </IconButton>
  );
};
