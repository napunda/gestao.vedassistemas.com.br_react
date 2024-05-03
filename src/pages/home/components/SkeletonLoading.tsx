import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

const skeletonCells = Array.from({ length: 10 }, (_, index) => (
  <TableCell key={index} className="py-4">
    {index === 0 ? (
      <Skeleton className="w-full h-[24px] rounded-full bg-gray-300"></Skeleton>
    ) : index === 9 ? (
      <Skeleton className="w-[24px] h-[24px] rounded-full bg-gray-300"></Skeleton>
    ) : (
      <Skeleton className="w-full h-[24px] rounded-full bg-gray-300"></Skeleton>
    )}
  </TableCell>
));

export const SkeletonLoading = () => {
  return Array.from({ length: 20 }, (_, index) => (
    <TableRow key={index}>{skeletonCells}</TableRow>
  ));
};
