import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";

export default function Terms() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Important Notice</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-gray-300">
        <ol className="list-decimal list-inside space-y-2">
          <li>
            The ore scooper tool is used to facilitate the irreversible burning
            of your tokens.
          </li>
          <li>By using this site, you are doing so at your own risk.</li>
          <li>
            By using the platform you explicitly accept full responsibility for
            any and all swaps. The ore-scooper platform additionally does not
            assume liability for any mistakes, accidents, miss-intentions or any
            other actions that led to an undesired burn.
          </li>
        </ol>
      </DialogDescription>
    </>
  );
}
