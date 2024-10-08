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
    </div>
  );
}
