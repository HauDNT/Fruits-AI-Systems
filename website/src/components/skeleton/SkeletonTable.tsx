import { Skeleton } from '@/components/ui/skeleton';

const SkeletonTable = ({ columns = 5, rows = 5 }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-1">
        {[...Array(rows)].map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-4 px-4 py-2 border-b animate-pulse">
            {[...Array(columns)].map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-4 w-full rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
