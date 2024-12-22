import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function How() {
  return (
    <div className="mt-6 text-sm text-gray-400">
      <p className="mb-4">
        Airdrops and adverts clutter your wallet. This tool allows you to
        quickly Scoop all your unwanted assets into $USDC stablecoin via{" "}
        <a href="https://jup.ag" className="underline text-blue-200">
          Jupiter
        </a>{" "}
        swaps.
      </p>

      <p className="mb-4">
        <strong>How it works:</strong>
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2">
        <li>Wait for assets to load</li>
        <li>Select assets for Scooping</li>
        <li>Review summary</li>
        <li>Convert to $USDC in a single click</li>
      </ul>

    </div>
  );
}
