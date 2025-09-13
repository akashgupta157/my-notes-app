"use client";

import { useState } from "react";
import { UpgradePlanProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, ArrowUp, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UpgradePlan({
  currentPlan,
  noteCount,
  maxFreeNotes,
  onUpgrade,
}: UpgradePlanProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await onUpgrade();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const plans = {
    free: {
      name: "Free Plan",
      price: "$0",
      description: "For small teams getting started",
      features: [
        `Up to ${maxFreeNotes} notes`,
        "Basic note management",
        "Multi-user support",
        "Role-based access",
      ],
      limitations: ["Limited to 3 notes", "No priority support"],
    },
    pro: {
      name: "Pro Plan",
      price: "$10",
      description: "For teams that need more power",
      features: [
        "Unlimited notes",
        "Advanced note management",
        "Priority support",
        "Export capabilities",
        "Custom themes",
        "Advanced security",
      ],
      limitations: [],
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Subscription Plans</h2>
        <Badge
          variant={currentPlan === "pro" ? "default" : "secondary"}
          className="text-sm"
        >
          {currentPlan === "pro" ? (
            <>
              <Crown className="mr-1 w-4 h-4" /> Pro Plan
            </>
          ) : (
            <>
              <Zap className="mr-1 w-4 h-4" /> Free Plan
            </>
          )}
        </Badge>
      </div>

      {currentPlan === "free" && (
        <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-amber-800 text-sm">
                Free plan limitations
              </h3>
              <div className="mt-2 text-amber-700 text-sm">
                <p>
                  You have created {noteCount} of {maxFreeNotes} notes on the
                  Free plan.
                  {noteCount >= maxFreeNotes && (
                    <span className="font-semibold">
                      {" "}
                      You have reached the limit!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <Card
          className={
            currentPlan === "free" ? "ring-2 ring-primary" : "opacity-80"
          }
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Free Plan
              <Badge variant="outline" className="ml-2">
                Current
              </Badge>
            </CardTitle>
            <CardDescription>For small teams getting started</CardDescription>
            <div className="mt-4">
              <span className="font-bold text-3xl">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="flex-shrink-0 mr-2 w-5 h-5 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={
            currentPlan === "pro"
              ? "ring-2 ring-primary border-primary"
              : "border-primary/20 relative overflow-hidden"
          }
        >
          {currentPlan !== "pro" && (
            <div className="top-0 right-0 absolute bg-primary px-2 py-1 rounded-bl-lg font-bold text-primary-foreground text-xs">
              RECOMMENDED
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Pro Plan
              {currentPlan === "pro" && (
                <Badge variant="default" className="ml-2">
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>For teams that need more power</CardDescription>
            <div className="mt-4">
              <span className="font-bold text-3xl">$10</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="flex-shrink-0 mr-2 w-5 h-5 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {currentPlan === "pro" ? (
              <Button className="w-full" variant="default" disabled>
                <Crown className="mr-2 w-4 h-4" /> Pro Plan Active
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <ArrowUp className="mr-2 w-4 h-4" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {currentPlan === "free" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Why upgrade to Pro?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center items-center bg-primary/10 mx-auto mb-2 rounded-full w-12 h-12">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Unlimited Notes</h4>
                <p className="mt-1 text-muted-foreground text-sm">
                  Create as many notes as you need without restrictions
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center bg-primary/10 mx-auto mb-2 rounded-full w-12 h-12">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Priority Support</h4>
                <p className="mt-1 text-muted-foreground text-sm">
                  Get help faster with our dedicated support team
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center bg-primary/10 mx-auto mb-2 rounded-full w-12 h-12">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Advanced Features</h4>
                <p className="mt-1 text-muted-foreground text-sm">
                  Access export, custom themes, and more
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
