import { useRef, useState } from 'react'

interface AudioRecorderProps {
  onRecorded: (blob: Blob, duration: number) => void
  disabled?: boolean
}

export function AudioRecorder({ onRecorded, disabled }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    recorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const duration = (Date.now() - startTimeRef.current) / 1000
      onRecorded(blob, duration)
      stream.getTracks().forEach((t) => t.stop())
    }

    recorder.start()
    startTimeRef.current = Date.now()
    setRecording(true)
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }

  function stopRecording() {
    recorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
    setSeconds(0)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (recording) {
    return (
      <button
        type="button"
        onClick={stopRecording}
        className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-xl text-sm font-medium animate-pulse"
      >
        <span className="w-2 h-2 bg-white rounded-full" />
        {formatTime(seconds)} — Parar
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="p-2.5 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition disabled:opacity-40"
      title="Gravar áudio"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  )
}
