import { STATUS_TONES } from '../data/mockData'

function StatusBadge({ status }) {
  const tone = STATUS_TONES[status] ?? STATUS_TONES.Active

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tone.badge}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
