# E-Commerce App - Quick Reference

## 🚀 Common Commands

### Start Development Server
```bash
npm start
```
Runs app in development mode at `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates optimized production build in `build/` folder

### Run Tests
```bash
npm test
```
Launches test runner in interactive watch mode

### Check Port Status
```bash
# Check if port 3000 is in use (macOS/Linux)
lsof -ti:3000

# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | API endpoints configuration |
| `src/App.tsx` | Main routing and layout |
| `src/index.tsx` | App entry point |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `package.json` | Dependencies and scripts |

## 🔐 Testing User Accounts

### Customer Account
- Role: Customer
- Features: Browse, Cart, Checkout, Orders

### Merchant Account  
- Role: Merchant
- Features: Dashboard, Products, Orders, Inventory

## 🛠 Updating API Endpoints

Edit `.env` file and update these endpoints:
```env
REACT_APP_AUTH_SERVICE_URL=your-auth-api
REACT_APP_PRODUCT_SERVICE_URL=your-product-api
REACT_APP_ORDER_SERVICE_URL=your-order-api
REACT_APP_REVIEW_SERVICE_URL=your-review-api
REACT_APP_INVENTORY_SERVICE_URL=your-inventory-api
```

After updating, restart dev server:
```bash
# Stop server (Ctrl+C) and run:
npm start
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Main Colors

- **Primary (Orange)**: `#ff6b35`
- **Success (Green)**: `#10b981`
- **Error (Red)**: `#ef4444`
- **Gray**: `#6b7280`

## 📂 Component Organization

```
components/
├── auth/          - Login, Register, ProtectedRoute
├── cart/          - Shopping cart components
├── common/        - Shared UI components
├── merchant/      - Merchant-specific features
├── order/         - Order display components
├── product/       - Product listing & details
└── review/        - Review system components
```

## 🔄 Component Import Pattern

```typescript
// Always import from the specific component file
import ComponentName from '../path/to/ComponentName';

// Use consistent naming (PascalCase for components)
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

export default MyComponent;
```

## 📝 Form Validation

Common validators available in `src/utils/validators.ts`:
- `isValidEmail(email)`
- `isValidPassword(password)`
- `isValidPhone(phone)`
- `isValidGST(gst)`
- `isValidName(name)`
- `isValidPrice(price)`

## 🎯 Page Routes

### Customer Routes
| Route | Component |
|-------|-----------|
| `/` | HomePage |
| `/products` | ProductListPage |
| `/products/:id` | ProductDetailPage |
| `/cart` | CartPage |
| `/checkout` | CheckoutPage |
| `/orders` | OrderHistoryPage |
| `/orders/:orderId` | OrderDetailPage |
| `/profile` | ProfilePage |

### Merchant Routes
| Route | Component |
|-------|-----------|
| `/merchant/dashboard` | MerchantDashboardPage |
| `/merchant/products` | ProductManagementPage |
| `/merchant/add-product` | AddProductPage |
| `/merchant/products/:id/edit` | EditProductPage |
| `/merchant/inventory` | InventoryPage |
| `/merchant/orders` | MerchantOrdersPage |
| `/merchant/profile` | MerchantProfilePage |

### Auth Routes
| Route | Component |
|-------|-----------|
| `/login` | LoginPage |
| `/auth/choose-role` | ChooseRolePage |
| `/auth/register` | RegisterPage |

## 🔗 API Integration Example

```typescript
import { productService } from '../../api/product.api';

// In component
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchProducts();
}, []);
```

## 🧪 Debugging Tips

### Check Console
- Open DevTools (F12 or Cmd+Option+I)
- Go to Console tab
- Look for errors and warnings

### Redux DevTools
- For state debugging, check localStorage:
- Open DevTools → Application → LocalStorage

### Network Tab
- See all API calls
- Check request/response payloads
- Monitor network errors

## ⚡ Performance Tips

1. **Code Splitting**: Already enabled by React Router
2. **Lazy Loading**: Use `React.lazy()` for heavy components
3. **Memoization**: Use `React.memo()` for expensive renders
4. **Tree Shaking**: Remove unused imports
5. **Compression**: Gzip enabled in production build

## 📦 Useful Packages to Add

```bash
# Payment processing
npm install stripe

# Email validation
npm install email-validator

# Date manipulation
npm install date-fns

# HTTP client already included (axios)

# Form builder
npm install formik yup
```

## 🚨 Common Issues & Fixes

### Port 3000 in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
npm start
```

### Dependencies Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Build Failures
```bash
# Clear cache and rebuild
npm cache clean --force
npm run build
```

### CORS Issues
- Ensure backend has CORS enabled
- Check API endpoints in `.env`
- Verify request headers

## 📞 Support

For issues or questions:
1. Check `SETUP_GUIDE.md` for detailed setup
2. Check `PROJECT_STATUS.md` for completion info
3. Review error messages in console
4. Check network tab for API issues

---

**Last Updated**: January 30, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
