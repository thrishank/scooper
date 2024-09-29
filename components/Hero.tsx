"use client";
import {
  RefreshCwIcon,
  ShieldCheckIcon,
  ZapIcon,
  ListIcon,
  FileTextIcon,
  ZapOffIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { LucideIcon } from "lucide-react";

interface StepProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ icon: Icon, title, description }) => (
  <div className="flex items-center p-4 rounded-lg bg-gray-100 mb-4">
    <div className="p-2 rounded-full bg-blue-500 text-white">
      <Icon size={24} />
    </div>
    <div className="ml-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const steps = [
  {
    icon: RefreshCwIcon,
    title: "Wait for assets to load",
    description:
      "Scooper checks your wallet for swappable assets and closeable accounts.",
  },
  {
    icon: ListIcon,
    title: "Select assets for Scooping",
    description:
      "Review the list and select assets you want to Scoop, or use 'Scoop all'.",
  },
  {
    icon: FileTextIcon,
    title: "Review summary",
    description: "Confirm the assets you've selected for Scooping.",
  },
  {
    icon: ZapOffIcon,
    title: "Scooper scoops",
    description: "Scooper processes transactions for each selected asset.",
  },
];
export function Hero() {
  return (
    <motion.div
      key="homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center space-y-6 mb-12">
        <h2 className="text-4xl font-bold text-gray-900">
          Easily convert your solana shit coins into one valuable coin in a
          single click
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select your shit coins, choose a target coin, and let us handle the
          conversion with real-time rates.
        </p>
      </section>

      <section className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          How Scooper Works
        </h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="flex flex-col items-center text-center">
          <ShieldCheckIcon className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
          <p className="text-gray-600">
            Your assets are protected with industry-leading security measures.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ZapIcon className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Fast Conversions</h3>
          <p className="text-gray-600">
            Experience lightning-fast crypto conversions with our optimized
            platform.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <RefreshCwIcon className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Real-time Rates</h3>
          <p className="text-gray-600">
            Get the most up-to-date conversion rates for accurate transactions.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
