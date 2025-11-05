# Smart Money Allocation Calculator

A comprehensive financial planning tool that provides personalized money allocation advice based on your location, age, income, and lifestyle.

## 🌟 Features

- **Smart Money Allocation**: Personalized budget recommendations
- **Multi-Currency Support**: 12 major currencies worldwide
- **Global Location Data**: 60+ cities with cost-of-living adjustments
- **User Authentication**: Complete login/registration system
- **Profile Management**: Save and edit personal financial information
- **Responsive Design**: Works perfectly on all devices
- **Real-time Calculations**: Instant budget breakdowns with expert advice

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download this repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 📁 Project Structure

```
smart-money-calculator/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── Results.tsx
│   │   ├── LoginPopup.tsx
│   │   ├── UserProfile.tsx
│   │   ├── AllocationItem.tsx
│   │   └── TestPanel.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useTimer.ts
│   ├── utils/            # Business logic
│   │   ├── allocationLogic.ts
│   │   ├── authStorage.ts
│   │   ├── cityData.ts
│   │   ├── currencyData.ts
│   │   └── suggestions.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx           # Main application
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Build configuration
├── tailwind.config.js    # Styling configuration
└── tsconfig.json         # TypeScript configuration
```

## 🧪 Testing

### Supabase Setup Required
To use the authentication and database features:

1. **Click the "Supabase" button** in the settings (top of preview)
2. **Create a new Supabase project** or connect existing one
3. **Environment variables** will be automatically configured
4. **Database migrations** will be applied automatically

### Admin Panel
Click the database icon in the bottom-right corner to view:
- All registered users from Supabase
- Database connection status
- Real-time user data

## 🌍 Supported Features

### Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- INR (Indian Rupee)
- BRL (Brazilian Real)
- MXN (Mexican Peso)
- SGD (Singapore Dollar)

### Global Cities
60+ cities across 6 continents with accurate cost-of-living data:
- **Americas**: US, Canada, Brazil, Mexico, Argentina, Chile, Peru, Colombia, Venezuela, Uruguay
- **Europe**: UK, France, Germany, Netherlands, Switzerland, Sweden, Spain, Italy
- **Asia**: Japan, Singapore, Hong Kong, China, India, South Korea, Thailand, Malaysia, Indonesia, Philippines, UAE, Israel
- **Africa**: South Africa, Nigeria, Kenya, Egypt, Morocco, Ghana, Ethiopia, Uganda, Tanzania, Rwanda, Tunisia, Algeria, Côte d'Ivoire, Senegal
- **Oceania**: Australia

## 🚀 Deployment Options

### Static Hosting (Recommended)

**Netlify:**
1. Run `npm run build`
2. Drag the `dist` folder to Netlify
3. Your site is live!

**Vercel:**
1. Connect your GitHub repository
2. Vercel automatically builds and deploys
3. Get automatic deployments on every push

**GitHub Pages:**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source as GitHub Actions
4. Use the provided workflow file

### Custom Domain
All hosting providers support custom domains. Simply:
1. Purchase your domain
2. Update DNS settings to point to your hosting provider
3. Configure SSL certificate (usually automatic)

## 🔧 Customization

### Adding New Cities
Edit `src/utils/cityData.ts` to add new cities with their cost-of-living multipliers.

### Adding New Currencies
Edit `src/utils/currencyData.ts` to add new currencies with their symbols.

### Modifying Allocation Logic
Edit `src/utils/allocationLogic.ts` to adjust the financial allocation algorithms.

### Styling Changes
The project uses Tailwind CSS. Modify classes in components or extend `tailwind.config.js`.

## 📊 Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building
- **Custom hooks** for state management

### Authentication
- In-memory storage for demo purposes
- JWT-style token system
- Session persistence via localStorage
- Password hashing for security

### Data Management
- Modular utility functions
- Comprehensive type definitions
- Separation of concerns
- Easy to extend and maintain

## 🔒 Security Notes

**Current Implementation:**
- Uses in-memory storage (demo purposes)
- Basic password hashing
- Client-side session management

**For Production:**
- Replace `authStorage.ts` with real database
- Implement server-side authentication
- Add proper password encryption
- Use secure session management
- Add rate limiting and validation

## 🤝 Contributing

This is a complete, standalone application ready for customization and expansion. Feel free to:

- Add new features
- Improve the UI/UX
- Integrate with real databases
- Add payment processing
- Create mobile apps
- Build advanced financial tools

## 📄 License

This project is provided as-is for your use and modification. Feel free to use it for personal or commercial projects.

## 🆘 Support

For questions about the code structure or implementation details, refer to the well-commented source code and TypeScript definitions.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**