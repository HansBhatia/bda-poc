"use client";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";

import { useState } from "react";
import { object, string } from "valibot";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { bidSchema, bidType } from "~/schemas/bid";

export default function Home() {
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<bidType>({
    resolver: valibotResolver(bidSchema),
    defaultValues: {
      aucId: "1",
      bidAmount: "130",
      bidPrice: "9980",
      salt: "102012010",
      uid: "1",
    },
  });

  async function onSubmit(values: bidType) {
    setIsLoading(true);
    console.log(values);
    const response = await fetch("/api/hash?" + new URLSearchParams(values), {
      method: "GET",
    });
    const hash = object({ hash: string() })._parse(await response.json()).output
      ?.hash;
    console.log(hash);
    if (hash) {
      setIsLoading(false);
      setHash(hash);
    } else {
      setIsLoading(false);
      console.error("error getting hash");
    }
  }
  return (
    <div className="flex flex-col shrink-0 items-center justify-center">
      <Separator className="h-5" />
      <div className="flex flex-col shrink-0 items-center justify-center bg-slate-100 w-1/2 rounded-md">
        <Separator className="h-5" />
        <h1 className="text-3xl font-bold underline">Bid Hash Calculator</h1>
        <Separator className="h-10" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User UID</FormLabel>
                  <FormControl>
                    <Input placeholder="2" {...field} />
                  </FormControl>
                  <FormDescription>This is your cbam uid.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aucId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction ID</FormLabel>
                  <FormControl>
                    <Input placeholder="5" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the auction&apos;s id.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="10000" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the amount of tokens that have been bid for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bidPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Price (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="9820" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the bid price with 2 decimal places of accuracy [0,
                    10000].
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="08331261482538463673268128691250"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the salt used for your bid.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              className="bg-black text-white"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
        <Separator className="h-5" />
        {!!hash && !isLoading && (
          <div className="text-xl text-center max-w-[80%]">
            <Separator className="h-5" />
            <div className="break-words">
              <p>Bid Hash is</p>
              <p className="text-left">&quot;{hash}&quot;</p>
            </div>
            <Separator className="h-10" />
          </div>
        )}
        {isLoading && (
          <div className="text-xl text-center max-w-[80%]">
            <Separator className="h-5" />
            <div className="break-words">
              <p>Loading ....</p>
            </div>
            <Separator className="h-10" />
          </div>
        )}
      </div>
    </div>
  );
}
