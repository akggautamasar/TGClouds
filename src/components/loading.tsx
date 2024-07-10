
export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="animate-spin">
        <svg
          className="w-16 h-16 text-primary-foreground"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4V2M12 22V20M4 12H2M22 12H20M18.3639 18.3639L16.95 16.95M7.05 7.05L5.6361 5.6361M18.3639 5.6361L16.95 7.05M7.05 16.95L5.6361 18.3639"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-primary-foreground text-2xl font-bold">Loading...</div>
    </div>
  )
}
