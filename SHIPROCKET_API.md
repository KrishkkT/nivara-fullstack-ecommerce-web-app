# Shiprocket API Integration Documentation

## Environment Variables Required

```
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
```

## Available API Endpoints

### Authentication
- POST `/api/auth/login` - Login to get token

### Pickup Locations
- GET `/api/shiprocket/pickup-locations` - Get all pickup locations
- POST `/api/shiprocket/pickup-locations/refresh` - Refresh pickup locations from Shiprocket

### Orders
- POST `/api/shiprocket/orders` - Create a new order
- GET `/api/shiprocket/orders/[id]` - Get order details
- PUT `/api/shiprocket/orders/[id]` - Update an order
- POST `/api/shiprocket/orders/cancel` - Cancel an order

### Shipments
- POST `/api/shiprocket/shipments/assign-awb` - Assign AWB to shipment
- POST `/api/shiprocket/labels` - Generate shipping label
- POST `/api/shiprocket/pickups` - Request pickup

### Couriers
- GET `/api/shiprocket/couriers` - Get all couriers
- POST `/api/shiprocket/couriers/refresh` - Refresh couriers from Shiprocket

### Tracking
- POST `/api/shiprocket/tracking` - Track shipment by AWB, shipment ID, or order ID

## Database Tables

1. `shiprocket_orders` - Stores order mappings between local and Shiprocket
2. `shiprocket_pickup_locations` - Cached pickup locations
3. `shiprocket_couriers` - Cached courier information
4. `shiprocket_tracking_events` - Tracking events history

## Implementation Notes

1. Authentication is handled automatically - the system logs in with credentials and caches the token
2. Data is cached in local database tables to reduce API calls
3. All endpoints require admin authentication
4. Proper error handling with descriptive messages