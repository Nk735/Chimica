interface ProgressBarProps {
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-green-100">
      <div
        className="h-full rounded-full bg-green-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
