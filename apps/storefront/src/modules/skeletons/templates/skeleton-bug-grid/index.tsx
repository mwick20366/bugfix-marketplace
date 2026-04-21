import repeat from "@lib/util/repeat"
import SkeletonBugPreview from "@modules/skeletons/components/skeleton-bug-preview"

const SkeletonBugGrid = ({
  numberOfBugs = 8,
}: {
  numberOfBugs?: number
}) => {
  return (
    <ul
      className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 flex-1"
      data-testid="bugs-list-loader"
    >
      {repeat(numberOfBugs).map((index) => (
        <li key={index}>
          <SkeletonBugPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonBugGrid
