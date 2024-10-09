import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function How() {
  return (
    <div className="mt-6 text-sm text-gray-400">
      <h2 className="text-lg font-semibold text-white mb-2">ORE Scooper</h2>
      <p className="mb-4">
        Airdrops and adverts clutter your wallet. This tool allows you to
        quickly Scoop all your unwanted assets into $ORE via{" "}
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
        <li>Convert to $ORE in a single click</li>
      </ul>

      <div className="flex space-x-4 mt-4">
        <a href="https://discord.com/invite/4TQfshAAsT" aria-label="Discord">
          <DiscordLogoIcon className="w-10 h-10 text-gray-400 hover:text-white" />
        </a>
        <a href="https://x.com/oresupply" aria-label="Twitter">
          <TwitterLogoIcon className="w-10 h-10 text-gray-400 hover:text-white" />
        </a>
        <a href="https://github.com/regolith-labs/ore" aria-label="Github">
          <GitHubLogoIcon className="w-10 h-10 text-gray-400 hover:text-white" />
        </a>
      </div>
    </div>
  );
}
