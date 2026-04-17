export async function uploadSingleImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing in environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed.')
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    public_id: data.public_id || null,
  }
}

export async function uploadMultipleImages(files) {
  if (!files?.length) return []
  const uploadPromises = files.map((file) => uploadSingleImage(file))
  return Promise.all(uploadPromises)
}

export async function deleteCloudinaryImages(publicIds = []) {
  const ids = [...new Set(publicIds.filter(Boolean))]
  if (!ids.length) {
    return { deleted: [] }
  }

  const deleteEndpoint = import.meta.env.VITE_CLOUDINARY_DELETE_ENDPOINT

  if (!deleteEndpoint) {
    // Temporary frontend mock until delete backend endpoint is available.
    await new Promise((resolve) => setTimeout(resolve, 120))
    return { deleted: ids, mode: 'mock' }
  }

  const response = await fetch(deleteEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_ids: ids }),
  })

  if (!response.ok) {
    throw new Error('Cloudinary deletion failed. Product was not removed.')
  }

  return response.json()
}
