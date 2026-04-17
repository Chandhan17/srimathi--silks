# Premium Saree Store

Production-ready saree storefront built with React + Vite, Tailwind CSS, Firebase Auth + Firestore, and Cloudinary image uploads.

## Features

- Royal Indian luxury UI theme with reusable branding config
- Home page with hero, premium collections, categories, and featured products
- Product listing with search and filters (category, price range, fabric)
- Product detail page with image gallery zoom and size chart support
- Quick Shop WhatsApp modal with localStorage customer autofill
- Admin authentication and protected product management route
- Firestore CRUD for products
- Cloudinary multi-image uploads with preview support
- Vercel-ready SPA routing config

## Environment Setup

Copy `.env.example` to `.env` and fill values:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_DELETE_ENDPOINT=
VITE_WHATSAPP_PHONE=919999999999
VITE_RAZORPAY_KEY_ID=
VITE_RAZORPAY_CREATE_ORDER_URL=/api/razorpay/create-order
```

Vercel backend env variables:

```bash
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Firebase Firestore Collection

Collection name: `products`

Document fields:

- `name`
- `price`
- `category`
- `description`
- `fabric`
- `images` (array of objects)
	- `{ url: string, public_id: string | null }`
- `sizeLength`
- `sizeChartText`
- `sizeChartImage`
- `createdAt`

Collection name: `orders`

Document fields:

- `productName`
- `price`
- `image`
- `selectedSize`
- `customer`
	- `name`
	- `phone`
	- `address`
- `paymentMethod` (`razorpay` | `whatsapp`)
- `paymentStatus` (`paid` | `pending`)
- `orderStatus` (`initiated` | `confirmed` | `completed`)
- `razorpayPaymentId`
- `createdAt`

## Product Deletion Flow

- Extract Cloudinary `public_id` values from `images`
- Attempt Cloudinary deletion first (via `VITE_CLOUDINARY_DELETE_ENDPOINT`)
- Delete Firestore product document only after asset deletion succeeds

If `VITE_CLOUDINARY_DELETE_ENDPOINT` is not set, a temporary frontend mock delete is used.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Client Branding Reuse

Update `src/config/clientConfig.js` only:

- `brandName`
- `logo`
- `theme` colors
- `whatsapp`
- `phone`
- `address`
- `tagline`

Theme color updates automatically propagate across the app.
