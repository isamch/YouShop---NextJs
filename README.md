# YouShop - E-Commerce Platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- NestJS Backend running
- npm or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Create `.env.local` file in the root directory:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 🔐 Authentication Testing

### Step 1: Configure Backend URL

Make sure your `.env.local` file has the correct backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Replace `http://localhost:3000/api` with your actual NestJS backend URL.

### Step 2: Test Login

1. Navigate to: `http://localhost:4000/auth/login`
2. Enter your credentials from the backend
3. Click "Sign In"

**Expected Behavior:**
- ✅ Successful login redirects to homepage
- ✅ Access token and refresh token are saved in localStorage
- ✅ User data is available in the app
- ❌ Invalid credentials show error message

### Step 3: Test Profile Page

1. After logging in, navigate to: `http://localhost:4000/profile`
2. You should see your user information

**Expected Behavior:**
- ✅ User details are displayed
- ✅ Debug information shows the full user object
- ✅ Logout button works correctly

### Step 4: Test Protected Routes

Try accessing `/profile` without logging in:
1. Logout if you're logged in
2. Navigate to: `http://localhost:4000/profile`

**Expected Behavior:**
- ✅ Automatically redirected to `/auth/login`

---

## 📡 API Endpoints

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products (Coming Soon)
- `GET /api/catalog/products` - Get all products
- `GET /api/catalog/products/:id` - Get product by ID
- `POST /api/catalog/products` - Create product (Admin)
- `PATCH /api/catalog/products/:id` - Update product (Admin)
- `DELETE /api/catalog/products/:id` - Delete product (Admin)

### Orders (Coming Soon)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Payments (Coming Soon)
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

---

## 🧪 Testing Authentication with Postman

Use the Postman collection in the `postman/` directory:

1. Import `YouShop_API_Collection.postman_collection.json`
2. Import `YouShop_Local_Environment.postman_environment.json`
3. Select the "YouShop - Local Development" environment
4. Run the "Login - Admin" request
5. The `accessToken` will be automatically saved

---

## 🛠️ Development Progress

### ✅ Completed
- [x] API Client setup with token management
- [x] Authentication service integration
- [x] Login page with error handling
- [x] Profile page
- [x] Auth context with state management
- [x] Automatic token refresh
- [x] Protected routes

### 🚧 In Progress
- [ ] Products integration
- [ ] Cart integration
- [ ] Orders integration
- [ ] Payment integration

### 📋 Planned
- [ ] Loading states and skeletons
- [ ] Toast notifications
- [ ] Error boundaries
- [ ] Form validation with Zod
- [ ] Search functionality
- [ ] Pagination

---

## 📁 Project Structure

```
YouShop/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Register page
│   ├── profile/           # User profile page
│   ├── products/          # Products pages
│   ├── cart/              # Shopping cart
│   └── checkout/          # Checkout process
│
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── header.tsx        # Header component
│   ├── footer.tsx        # Footer component
│   └── product-card.tsx  # Product card
│
├── contexts/             # React Context providers
│   ├── auth-context.tsx  # Authentication state
│   └── cart-context.tsx  # Cart state
│
├── lib/                  # Utilities and services
│   ├── services/         # API services
│   │   ├── api-client.ts      # HTTP client
│   │   ├── auth-service.ts    # Auth API calls
│   │   ├── product-service.ts # Products API calls
│   │   └── order-service.ts   # Orders API calls
│   ├── types/           # TypeScript types
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
│
└── postman/             # API testing
    ├── YouShop_API_Collection.postman_collection.json
    └── YouShop_Local_Environment.postman_environment.json
```

---

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### Issue: "Network error occurred"
**Solution:** Make sure your NestJS backend is running and the `NEXT_PUBLIC_API_URL` is correct.

### Issue: "401 Unauthorized"
**Solution:** Your token might have expired. Try logging in again.

### Issue: "Cannot find module"
**Solution:** Run `npm install` or `pnpm install` again.

### Issue: Changes not reflecting
**Solution:** 
1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder
3. Run `npm run dev` again

---

## 📚 Technologies Used

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Fetch API with custom wrapper
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

---

## 📝 Notes

- The frontend is configured to work with a microservices architecture
- JWT tokens are automatically managed (access + refresh)
- All API calls include automatic error handling
- Protected routes automatically redirect to login

---

## 🤝 Contributing

This is a learning project. Feel free to explore and modify!

---

## 📄 License

MIT License - Feel free to use this project for learning purposes.
