export function normalizeImageItem(item) {
  if (!item) return null

  if (typeof item === 'string') {
    return { url: item, public_id: null }
  }

  if (typeof item === 'object' && typeof item.url === 'string') {
    return {
      url: item.url,
      public_id: item.public_id || null,
    }
  }

  return null
}

export function normalizeImages(items = []) {
  return items.map(normalizeImageItem).filter(Boolean)
}

export function getImageUrl(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  return item.url || ''
}

export function getImagePublicId(item) {
  if (!item || typeof item === 'string') return ''
  return typeof item.public_id === 'string' ? item.public_id : ''
}

export function getPrimaryImageUrl(images, fallback = '') {
  const first = Array.isArray(images) ? images[0] : null
  return getImageUrl(first) || fallback
}