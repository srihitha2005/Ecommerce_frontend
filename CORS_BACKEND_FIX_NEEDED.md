# 🔴 CORS Configuration Required - Backend Fix

## Issue
The frontend is unable to communicate with backend microservices due to **CORS (Cross-Origin Resource Sharing)** restrictions.

### Current Error
```
Access to XMLHttpRequest at 'https://product-service-jzzf.onrender.com/api/v1/products' 
from origin 'http://localhost:3001' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## Solution Required

All backend microservices need to add CORS headers to their responses.

### Services Needing CORS Fix

1. **Auth Service** - `https://auth-service-qivh.onrender.com`
2. **Product Service** - `https://product-service-jzzf.onrender.com`
3. **Review Service** - `https://review-service-z6zl.onrender.com`
4. **Inventory Service** - `https://inventory-q6gj.onrender.com`
5. **Order Service** - `https://order-service-p792.onrender.com`
6. **Notification Service** - `https://notification-service.onrender.com`
7. **Search Service** - `https://search-service.onrender.com`
8. **Merchant Ranking Service** - `https://merchant-ranking-service.onrender.com`

---

## CORS Headers Needed

Add these headers to **ALL responses** from backend endpoints:

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Origin: https://yourdomain.com (for production)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### For Spring Boot (Java)
Add to your Spring Configuration:

```java
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3001", "https://yourdomain.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true)
            .maxAge(86400);
    }
}
```

### For Node.js/Express
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3001', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### For Python/Flask
```python
from flask_cors import CORS

CORS(app, 
     origins=['http://localhost:3001', 'https://yourdomain.com'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)
```

---

## Frontend Status

✅ **Frontend is ready to communicate** once CORS is configured on backend

**Current Frontend Configuration:**
- Login with role selection (CUSTOMER/MERCHANT)
- Better error messages on login
- Logout confirmation dialog
- Displays user name instead of email
- All form validation in place

---

## What to Test After CORS Fix

1. ✅ Login as Customer
2. ✅ Login as Merchant
3. ✅ View Products Page
4. ✅ Search Products
5. ✅ View Product Details with Reviews
6. ✅ Add to Cart
7. ✅ Checkout
8. ✅ View Order History

---

## Quick Checklist

- [ ] Configure CORS on Auth Service
- [ ] Configure CORS on Product Service
- [ ] Configure CORS on Review Service
- [ ] Configure CORS on Inventory Service
- [ ] Configure CORS on Order Service
- [ ] Configure CORS on Notification Service
- [ ] Test login from frontend
- [ ] Test product browsing
- [ ] Test adding to cart
- [ ] Test checkout

---

## Support

If you need help with CORS configuration, ask your backend team or refer to:
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Enable CORS Anywhere](https://enable-cors.org/)
