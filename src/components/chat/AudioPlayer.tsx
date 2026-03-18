import { useRef, useState } from 'react'

interface AudioPlayerProps {
  src: string
  fileName?: string
}

export function AudioPlayer({ src, fileName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio) return
    setProgress((audio.currentTime / audio.duration) * 100 || 0)
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current?.duration ?? 0)
  }

  function handleEnded() {
    setPlaying(false)
    setProgress(0)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * duration
    setProgress(ratio * 100)
  }

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition shrink-0"
      >
        {playing ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {fileName && <span className="text-xs opacity-70 truncate">{fileName}</span>}
        <div
          className="h-1.5 bg-white/30 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-white/80 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs opacity-60">{formatTime(duration)}</span>
      </div>
    </div>
  )
}
