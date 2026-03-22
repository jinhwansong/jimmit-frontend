import ShimmerSkeleton from '../ShimmerSkeleton';

export default function SkeletonItem() {
  return (
    <div className="min-h-[396px]">
      <ShimmerSkeleton className="pc:aspect-[8/5] tab:aspect-[87/25] aspect-[343/200] rounded-lg" />
      <div className="mt-[1.25rem] flex flex-wrap gap-[0.375rem]">
        {[...Array(4)].map((_, i) => (
          <ShimmerSkeleton key={i} className="h-8 w-14 rounded-lg" />
        ))}
      </div>
      <ShimmerSkeleton className="mt-5 h-[1.125rem] w-60" />
      <ShimmerSkeleton className="mt-5 h-4 w-60" />
      <div className="mt-5 border-t border-t-[#393940] pt-[1.37rem]">
        <div className="flex items-center justify-between">
          <ShimmerSkeleton className="h-6 w-20 rounded" />
          <ShimmerSkeleton className="h-6 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
