import './FloorMapPreview.scss'

const previewBooths = [
  '',
  '',
  'A-03',
  '',
  '',
  '',
  'A-07',
  '',
  '',
  '',
  'B-03',
  '',
  '',
  '',
  '',
  '',
]

export function FloorMapPreview() {
  return (
    <div className="floor-grid-preview" aria-label="Floor map preview">
      {previewBooths.map((label, index) => {
        const style =
          label === 'A-03'
            ? 'booth-tile--purple'
            : label === 'A-07'
              ? 'booth-tile--teal'
              : label === 'B-03'
                ? 'booth-tile--pink'
                : ''

        return (
          <div className={`booth-tile ${style}`.trim()} key={`${label}-${index}`}>
            {label || 'Open booth'}
          </div>
        )
      })}
    </div>
  )
}
