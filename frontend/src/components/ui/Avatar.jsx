function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const palette = [
  '#F97316', '#2E7D32', '#2563EB', '#9333EA',
  '#D97706', '#DC2626', '#0891B2', '#4B1F0E',
]

function colorFor(name = '') {
  let hash = 0
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

const sizes = { xs: 24, sm: 28, md: 36, lg: 44, xl: 56 }

export function Avatar({ name, src, size = 'md', className = '' }) {
  const px = sizes[size] ?? sizes.md
  const font = px * 0.36

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={px}
        height={px}
        className={className}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }

  return (
    <div
      className={className}
      aria-label={name}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        background: colorFor(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: font,
        fontWeight: 700,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials(name)}
    </div>
  )
}
