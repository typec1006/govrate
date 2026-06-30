export default function RankingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="w-12 h-8 bg-gray-200 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}
