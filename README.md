# Kinance Mobile

A React Native mobile application for the Kinance family finance management API. Built with Expo, TypeScript, and modern React Native patterns.

## Features

- **User Authentication**: Secure login and registration with JWT token management
- **Dashboard**: Financial overview with budget summaries and recent transactions
- **Budget Management**: Create, track, and manage family budgets
- **Transaction Tracking**: Record and categorize financial transactions
- **Receipt Management**: Upload and process receipt images with AI
- **Profile Management**: User profile and family member management

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Expo Vector Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   └── forms/          # Form-specific components
├── constants/          # App constants and configuration
├── hooks/              # Custom hooks and Zustand stores
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── dashboard/      # Dashboard screens
│   ├── budgets/        # Budget management screens
│   ├── transactions/   # Transaction screens
│   ├── receipts/       # Receipt management screens
│   └── profile/        # Profile screens
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For iOS development: Xcode
- For Android development: Android Studio

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kinance-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API endpoint:**
   - Open `src/constants/config.ts`
   - Update `BASE_URL` to point to your Kinance API server
   - For development: `http://localhost:8080` (default)
   - For production: Update to your production API URL

### Development

1. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

2. **Run on specific platforms:**
   ```bash
   # iOS Simulator
   npx expo start --ios
   
   # Android Emulator
   npx expo start --android
   
   # Web browser
   npx expo start --web
   ```

3. **Run on physical device:**
   - Install Expo Go app on your device
   - Scan the QR code from the terminal/browser

### API Integration

The app connects to the Kinance API backend. Ensure the API server is running and accessible:

1. **Start the Kinance API server** (from the kinance directory):
   ```bash
   cd ../kinance
   make docker-run
   make run-app
   ```

2. **API Base URL Configuration:**
   - Development: `http://localhost:8080`
   - Update `src/constants/config.ts` for production deployment

### Key Features Implementation

#### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Secure token storage with AsyncStorage
- Logout functionality with token cleanup

#### State Management
- Zustand for global state management
- Separate stores for auth and app data
- Automatic state persistence

#### Navigation
- Stack navigation for auth flow
- Tab navigation for main app
- Type-safe navigation with TypeScript

#### API Integration
- Axios HTTP client with interceptors
- Automatic token injection
- Error handling and token refresh
- File upload support for receipts

## Building for Production

### Android

1. **Configure app signing:**
   ```bash
   npx expo build:android
   ```

2. **Generate APK:**
   ```bash
   npx expo export:android
   ```

### iOS

1. **Build for App Store:**
   ```bash
   npx expo build:ios
   ```

2. **Generate IPA:**
   ```bash
   npx expo export:ios
   ```

## Environment Variables

The app uses the following configuration in `src/constants/config.ts`:

- `BASE_URL`: API server base URL
- `API_VERSION`: API version (v1)
- `TIMEOUT`: Request timeout (10000ms)
- `STORAGE_KEYS`: AsyncStorage keys for tokens and user data

## Development Guidelines

### Code Structure
- Use TypeScript for type safety
- Follow component-based architecture
- Implement custom hooks for business logic
- Use proper error handling and loading states

### Navigation
- Type-safe navigation with param lists
- Proper screen organization
- Deep linking support ready

### State Management
- Zustand stores for global state
- Local component state for UI state
- Proper state updates and subscriptions

### API Integration
- Centralized API service
- Request/response interceptors
- Error handling and retry logic
- Type-safe API responses

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npx expo install` - Install Expo-compatible packages

## Contributing

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Test on both iOS and Android platforms
4. Submit a pull request

## API Endpoints Used

The mobile app integrates with these Kinance API endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/users/profile` - Get user profile
- `GET /api/v1/budgets` - Get user budgets
- `GET /api/v1/transactions` - Get user transactions
- `POST /api/v1/receipts/upload` - Upload receipts

## Future Enhancements

- [ ] Complete budget CRUD operations
- [ ] Complete transaction CRUD operations
- [ ] Receipt processing with AI integration
- [ ] Push notifications
- [ ] Offline support with data sync
- [ ] Biometric authentication
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Data visualization and charts

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues:**
   ```bash
   npx expo start --clear
   ```

2. **Native module issues:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS simulator issues:**
   ```bash
   npx expo install --fix
   ```

### API Connection Issues

- Verify the API server is running
- Check the `BASE_URL` in config
- Ensure network connectivity
- Check CORS settings on API server

## License

MIT

## Support

For support and questions:
- Check the Kinance API documentation
- Review the React Native and Expo documentation
- Create an issue in the project repository
