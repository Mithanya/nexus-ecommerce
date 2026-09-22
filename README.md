# Nexus Store

A responsive full-stack commerce experience for premium consumer technology. Nexus combines an editorial React storefront with a Django API, SQLite persistence, product filtering, shopping bag interactions, and order creation.

## Highlights

- Responsive React and Vite storefront for desktop and mobile
- Animated iPhone 18 Pro Max Burgundy launch hero
- Product departments for phones, computers, and wearables
- Three products displayed per department
- Product catalog loaded from Django JSON APIs
- Shopping bag with quantity controls and totals
- Card and UPI checkout interface
- Orders and order items persisted in SQLite
- Contact form connected to the backend API
- Local product imagery served through Vite

## Stack

- **Frontend:** React, Vite, modern CSS
- **Backend:** Python, Django
- **Database:** SQLite
- **API:** Django JSON endpoints

## Repository Layout

```text
.
├── backend/                 Django project configuration
├── store_api/               Products, orders, migrations, and API views
├── frontend/                React and Vite application
│   └── src/                 React components and styles
├── assets/                  Product images
├── manage.py                Django command-line entry point
├── requirements.txt         Python dependencies
└── db.sqlite3               Local development database
```

## Local Development

### 1. Start the Django API

From the repository root:

```powershell
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The API is available at `http://127.0.0.1:8000`.

### 2. Start the React app

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The storefront is available at `http://127.0.0.1:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/products/` | Return the product catalog |
| `GET` | `/api/products/?category=iphone` | Filter products by department |
| `POST` | `/api/orders/` | Validate and save an order |
| `POST` | `/api/contact/` | Submit a support message |

Example order payload:

```json
{
	"customerName": "Nexus customer",
	"paymentMethod": "card",
	"items": [
		{ "productId": 11, "quantity": 1 }
	]
}
```

## Verification

```powershell
python manage.py check
python manage.py migrate
cd frontend
npm run build
```

## Payment Note

Checkout currently creates a pending order and provides a complete demo payment flow. Live payment capture requires a provider such as Stripe or Razorpay, merchant credentials, and webhook verification.

## License

This project is provided for development and portfolio use.
