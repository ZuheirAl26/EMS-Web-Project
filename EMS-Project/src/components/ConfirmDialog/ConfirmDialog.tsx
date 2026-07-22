import { Button } from "../Button";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  message,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog">
      <h2>{title}</h2>
      <p>{message}</p>
      <Button onClick={onConfirm}>Confirm</Button>
    </div>
  );
}
