import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

export const SkeletonCardLoading = () => {
  return (
    <Card className="rounded">
      <CardHeader className="flex justify-between flex-row items-start border-b py-3">
        <CardTitle className="text-sm font-bold">
          <Skeleton className="w-28 h-5 rounded-full bg-gray-300" />
        </CardTitle>
        <Skeleton className="w-5 h-2 rounded-full bg-gray-300" />
      </CardHeader>

      <CardContent className="py-3">
        <div className="flex items-start flex-row justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 p-2 border rounded-full bg-gray-300" />
            <div className="grid gap-1">
              <span className="font-bold">
                <Skeleton className="w-24 h-4 rounded-full bg-gray-300" />
              </span>
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded-full bg-gray-300" />
                <span className="text-xs text-muted-foreground">
                  <Skeleton className="w-20 h-3 rounded-full bg-gray-300" />
                </span>
              </div>
            </div>
          </div>
          <Skeleton className="w-10 h-4 rounded-full bg-gray-300" />
        </div>
        <div className="mt-8 grid gap-2">
          <div className="flex justify-between">
            <span>
              <Skeleton className="w-10 h-3 rounded-full bg-gray-300" />
            </span>
            <div className="line-clamp-2 text-sm text-muted-foreground">
              <Skeleton className="w-24 h-3 rounded-full bg-gray-300" />
            </div>
          </div>
          <div className="flex justify-between">
            <span>
              <Skeleton className="w-10 h-3 rounded-full bg-gray-300" />
            </span>
            <div className="line-clamp-2 text-sm text-muted-foreground">
              <Skeleton className="w-24 h-3 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-5 grid gap-3">
        <div className="flex justify-between">
          <span>
            <Skeleton className="w-16 h-3 rounded-full bg-gray-300" />
          </span>
          <Skeleton className="w-10 h-3 rounded-full bg-gray-300" />
        </div>
        <div className="flex justify-between">
          <span>
            <Skeleton className="w-16 h-3 rounded-full bg-gray-300" />
          </span>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="w-10 h-3 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="flex justify-between">
          <span>
            <Skeleton className="w-16 h-3 rounded-full bg-gray-300" />
          </span>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="w-10 h-3 rounded-full bg-gray-300" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
