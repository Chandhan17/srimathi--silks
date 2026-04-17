import Razorpay from 'razorpay'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay credentials are missing.' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const amount = Number(body?.amount)
    const currency = body?.currency || 'INR'
    const receipt = body?.receipt || `receipt_${Date.now()}`

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required.' })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: 1,
    })

    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unable to create Razorpay order.' })
  }
}
