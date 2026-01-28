"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
  gradient?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
}

const gradientClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-emerald-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
  cyan: "from-cyan-500 to-cyan-600",
};

const iconBgClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  cyan: "bg-cyan-100 text-cyan-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  gradient = "blue",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className,
      )}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 bg-gradient-to-br",
          gradientClasses[gradient],
        )}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              iconBgClasses[gradient],
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-600",
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
