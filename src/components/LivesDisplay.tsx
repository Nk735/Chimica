interface LivesDisplayProps {
  lives: number
}

export const LivesDisplay = ({ lives }: LivesDisplayProps) => {
  return (
    <div className="flex items-center gap-1 text-xl" aria-label={`${lives} lives remaining`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <span key={index} className={index < lives ? 'opacity-100' : 'opacity-30'}>
          ❤️
        </span>
      ))}
    </div>
  )
}
