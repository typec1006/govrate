export default function VoteSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg mb-4" />
      <div className="flex flex-wrap gap-2 mb-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
