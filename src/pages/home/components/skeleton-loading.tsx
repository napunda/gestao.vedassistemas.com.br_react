import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

const skeletonCells = Array.from({ length: 11 }, (_, index) => (
  <TableCell key={index} className="py-4">
    {index === 0 ? (
      <Skeleton className="w-full h-[18px] rounded-full bg-gray-300"></Skeleton>
    ) : (
      <Skeleton className="w-full h-[20px] rounded-full bg-gray-300"></Skeleton>
    )}
  </TableCell>
));

export const SkeletonLoading = () => {
  return (
    <>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
      <TableRow>{skeletonCells}</TableRow>
    </>
  );
};
