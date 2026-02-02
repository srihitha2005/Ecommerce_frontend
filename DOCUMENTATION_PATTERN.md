# Documentation Pattern Guide

## Overview
Every source file should have:
1. **File Header** (30-50 lines) - Explains what the file does
2. **Revision Notes** - Explains libraries, keywords, patterns used

---

## File Header Template

```typescript
/**
 * ============================================================================
 * [FILE NAME] - [Brief Description]
 * ============================================================================
 * 
 * PURPOSE:
 * - [What this file/component does]
 * - [Main responsibility]
 * - [Key features]
 * 
 * KEY ARCHITECTURE DECISIONS:
 * - [Why built this way]
 * - [Important patterns used]
 * - [Design choices explained]
 * 
 * FLOW / LIFECYCLE:
 * Step 1 → Step 2 → Step 3
 *    ↓
 * User action or side effect
 *    ↓
 * Result/State change
 * 
 * KEY CONCEPTS:
 * - Concept 1: [Explanation]
 * - Concept 2: [Explanation]
 * 
 * RELATED FILES:
 * - src/file1.ts → [How it's used]
 * - src/file2.tsx → [How it's used]
 * 
 * ============================================================================
 */
```

---

## Revision Note Template (for Key Concepts)

Placed in code immediately before the concept:

```typescript
/**
 * [CONCEPT NAME] (Revision Note):
 * 
 * 1. PURPOSE:
 *    - [Why this exists]
 *    - [What problem it solves]
 * 
 * 2. HOW IT WORKS:
 *    - [Step-by-step explanation]
 * 
 * 3. WHY THIS APPROACH:
 *    - [Alternative approaches considered]
 *    - [Why this one is better]
 * 
 * 4. TYPESCRIPT / SYNTAX:
 *    - [If using advanced TypeScript]
 *    - [Generic types, interfaces, etc.]
 * 
 * 5. COMMON MISTAKES:
 *    - [What not to do]
 *    - [How to avoid bugs]
 * 
 * 6. EXAMPLE:
 *    ```
 *    // Code example showing usage
 *    ```
 */
```

---

## Files Already Documented

✅ **Context Files:**
- `src/context/AuthContext.tsx` - Complete header + revision notes
- `src/context/CartContext.tsx` - Complete header + revision notes

✅ **API Configuration:**
- `src/api/axios.config.ts` - Complete header + request/response interceptor notes
- `src/api/order.api.ts` - Complete header + async/promises revision note

---

## Files Remaining to Document

### **API Services** (6 files)
- [ ] `src/api/auth.api.ts`
- [ ] `src/api/product.api.ts`
- [ ] `src/api/inventory.api.ts`
- [ ] `src/api/review.api.ts`
- [ ] `src/api/search.api.ts`
- [ ] `src/api/notification.api.ts`

### **Hooks** (6 files)
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useCart.ts`
- [ ] `src/hooks/useDebounce.ts`
- [ ] `src/hooks/useNotification.ts`
- [ ] `src/hooks/useProducts.ts`
- [ ] `src/hooks/useLocalStorage.ts`

### **Auth Components** (4 files)
- [ ] `src/components/auth/LoginForm.tsx` (Partially done)
- [ ] `src/components/auth/RegisterForm.tsx`
- [ ] `src/components/auth/MerchantRegisterForm.tsx`
- [ ] `src/components/auth/ProtectedRoute.tsx`

### **Common Components** (5 files)
- [ ] `src/components/common/Header.tsx`
- [ ] `src/components/common/Navbar.tsx`
- [ ] `src/components/common/Footer.tsx`
- [ ] `src/components/common/Modal.tsx`
- [ ] `src/components/common/ErrorBoundary.tsx`

### **Product Components** (5 files)
- [ ] `src/components/product/ProductCard.tsx`
- [ ] `src/components/product/ProductDetail.tsx`
- [ ] `src/components/product/ProductGrid.tsx`
- [ ] `src/components/product/ProductFilters.tsx`
- [ ] `src/components/product/ProductSearch.tsx`

### **Cart Components** (3 files)
- [ ] `src/components/cart/CartDrawer.tsx`
- [ ] `src/components/cart/CartItem.tsx`
- [ ] `src/components/cart/CartSummary.tsx`

### **Review Components** (4 files)
- [ ] `src/components/review/ReviewForm.tsx`
- [ ] `src/components/review/ReviewList.tsx`
- [ ] `src/components/review/ReviewCard.tsx`
- [ ] `src/components/review/RatingStars.tsx`

### **Merchant Components** (5 files)
- [ ] `src/components/merchant/MerchantDashboard.tsx`
- [ ] `src/components/merchant/ProductForm.tsx`
- [ ] `src/components/merchant/SalesChart.tsx`
- [ ] `src/components/merchant/InventoryManager.tsx`
- [ ] `src/components/merchant/MerchantLayout.tsx`

### **Order Components** (3 files)
- [ ] `src/components/order/OrderCard.tsx`
- [ ] `src/components/order/OrderDetails.tsx`
- [ ] `src/components/order/OrderTimeline.tsx`

### **Pages - Auth** (3 files)
- [ ] `src/pages/auth/LoginPage.tsx`
- [ ] `src/pages/auth/RegisterPage.tsx`
- [ ] `src/pages/auth/ChooseRolePage.tsx`

### **Pages - Customer** (8 files)
- [ ] `src/pages/customer/HomePage.tsx`
- [ ] `src/pages/customer/ProductListPage.tsx`
- [ ] `src/pages/customer/ProductDetailPage.tsx`
- [ ] `src/pages/customer/CartPage.tsx`
- [ ] `src/pages/customer/CheckoutPage.tsx`
- [ ] `src/pages/customer/OrderHistoryPage.tsx`
- [ ] `src/pages/customer/OrderDetailPage.tsx`
- [ ] `src/pages/customer/ProfilePage.tsx`

### **Pages - Merchant** (6 files)
- [ ] `src/pages/merchant/MerchantDashboardPage.tsx`
- [ ] `src/pages/merchant/ProductManagementPage.tsx`
- [ ] `src/pages/merchant/AddProductPage.tsx`
- [ ] `src/pages/merchant/EditProductPage.tsx`
- [ ] `src/pages/merchant/InventoryPage.tsx`
- [ ] `src/pages/merchant/MerchantOrdersPage.tsx`

### **Utility Files** (6 files)
- [ ] `src/utils/constants.ts`
- [ ] `src/utils/formatters.ts`
- [ ] `src/utils/helpers.ts`
- [ ] `src/utils/validators.ts`
- [ ] `src/utils/storage.ts`
- [ ] `src/utils/tokenDebugger.ts`

### **Type Files** (8 files)
- [ ] `src/types/auth.types.ts`
- [ ] `src/types/product.types.ts`
- [ ] `src/types/cart.types.ts`
- [ ] `src/types/order.types.ts`
- [ ] `src/types/review.types.ts`
- [ ] `src/types/inventory.types.ts`
- [ ] `src/types/api.types.ts`

### **Main App Files** (2 files)
- [ ] `src/App.tsx`
- [ ] `src/index.tsx`

---

## Key Revision Notes to Add

### Common Patterns

**1. React Hooks (useState, useEffect, useContext)**
```typescript
/**
 * REACT HOOKS (Revision Note):
 * 
 * 1. useState: Adds state to functional components
 *    - const [state, setState] = useState(initialValue)
 *    - Each call to setState triggers re-render
 *    - Multiple useState calls allowed
 * 
 * 2. useEffect: Side effects (network, localStorage, timers)
 *    - useEffect(() => { ... }, [dependencies])
 *    - Runs after render, not during render
 *    - Empty deps [] = run once on mount
 *    - Deps [x, y] = run when x or y changes
 * 
 * 3. useContext: Access global state without prop drilling
 *    - const value = useContext(SomeContext)
 *    - Component must be inside Provider
 *    - Causes re-render when context value changes
 */
```

**2. TypeScript Generics**
```typescript
/**
 * TYPESCRIPT GENERICS (Revision Note):
 * 
 * 1. PURPOSE: Write flexible, reusable types
 * 
 * 2. SYNTAX:
 *    - Generic function: function getName<T>(arr: T[]): T
 *    - Generic interface: interface Box<T> { content: T }
 *    - Generic component: <T extends object>(props: T) => JSX
 * 
 * 3. EXAMPLE:
 *    Promise<CartResponse> means:
 *    - Promise that resolves to CartResponse type
 *    - If promise rejects, error is caught in .catch()
 *    - Enables autocomplete for response.data.items
 */
```

**3. React Router**
```typescript
/**
 * REACT ROUTER v6 (Revision Note):
 * 
 * 1. useNavigate: Programmatic routing
 *    - const navigate = useNavigate()
 *    - navigate('/path') = go to path
 *    - navigate('/path', { replace: true }) = replace history
 * 
 * 2. useParams: Extract URL parameters
 *    - const { id } = useParams<{ id: string }>()
 *    - Used in routes like /products/:id
 * 
 * 3. <Route path="/"> = renders component when path matches
 *    - Nested routes inherit parent path
 *    - Protected routes use custom wrapper component
 */
```

**4. Axios & Error Handling**
```typescript
/**
 * AXIOS ERROR HANDLING (Revision Note):
 * 
 * 1. try/catch pattern:
 *    try {
 *      const response = await api.get('/endpoint')
 *      setData(response.data)
 *    } catch (error: any) {
 *      // error.response.status = HTTP status code
 *      // error.response.data = backend error message
 *      // error.message = axios error message
 *    }
 * 
 * 2. Status codes:
 *    - 2xx = Success
 *    - 400 = Bad request (validation error)
 *    - 401 = Unauthorized (expired token)
 *    - 403 = Forbidden (invalid token/role)
 *    - 404 = Not found
 *    - 5xx = Server error
 * 
 * 3. Interceptors: Global error handling
 *    - Applied to ALL requests/responses automatically
 *    - No need to repeat error logic in components
 */
```

**5. React Context**
```typescript
/**
 * REACT CONTEXT (Revision Note):
 * 
 * 1. CREATION:
 *    const Context = createContext<Type | undefined>(undefined)
 *    
 * 2. PROVIDER:
 *    <Context.Provider value={data}>
 *      {children}
 *    </Context.Provider>
 * 
 * 3. CONSUMER (Hook):
 *    const data = useContext(Context)
 *    
 * 4. WHY CONTEXT:
 *    - Avoids prop drilling (passing props through many levels)
 *    - Simplifies global state (auth, cart, notifications)
 *    - Re-renders all consumers when value changes
 * 
 * 5. PERFORMANCE NOTE:
 *    - Each consumer re-renders when context value changes
 *    - Use useMemo() to prevent unnecessary re-renders
 *    - Split contexts for independent state
 */
```

---

## Quick Reference: Where to Add Notes

| Concept | Location | Example |
|---------|----------|---------|
| React Hooks | At top of component function | Before useState/useEffect |
| TypeScript Generics | At interface/function definition | Before `<T>` |
| axios Patterns | In service files | Before try/catch |
| React Router | In route setup | Before `<Route>` |
| Context | In createContext/Provider | Before context creation |
| Conditional Rendering | In JSX | Before `{condition && <Component />}` |

---

## Priorities

**High Priority** (Most important for reviewers):
1. API services (axios patterns)
2. Contexts (state management)
3. Hooks (patterns)
4. Auth components
5. Main pages (Page components)

**Medium Priority**:
6. Product/Cart/Review components
7. Merchant components
8. Utilities

**Low Priority**:
9. Type files (mostly self-documenting)
10. Styling files

---

## Style Guide

- **Use ✅ ⚠️ 🔴** emojis for status indicators
- **Use 📡 🔑 ❌ 📥** emojis for action indicators
- **Bold key concepts**: `**React Context**`, `**JWT Token**`
- **Code blocks for examples**: ` ```typescript ... ``` `
- **Keep lines ~80 characters** (readable on smaller screens)
- **Use numbering for processes**: `1. First step`, `2. Second step`

---

