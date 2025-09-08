# Debugging Guide for Kinance Mobile

## 🔍 Common Issues & Solutions

### App Crashes on Startup

#### **1. Check Metro Bundler Logs**
When running `npx expo start`, look for errors in the terminal:
- **Red error messages** - JavaScript errors
- **Yellow warnings** - Non-critical issues but may cause problems
- **Bundle errors** - Import/export issues

#### **2. Check Device/Simulator Logs**

**iOS Simulator:**
```bash
# Open iOS Simulator logs
npx expo start --ios
# Then check logs in: Device > Console
```

**Android Emulator:**
```bash
# Check Android logs
npx expo start --android
# In another terminal:
adb logcat *:S ReactNative:V ReactNativeJS:V
```

**Physical Device (Expo Go):**
- Shake device to open developer menu
- Tap "Debug JS Remotely" to see errors in browser

#### **3. Most Common Fixes**

**Clear Metro Cache:**
```bash
npx expo start --clear
```

**Reinstall Dependencies:**
```bash
rm -rf node_modules
npm install
```

**Reset Expo Cache:**
```bash
expo r -c
```

---

### Specific Error Patterns

#### **Import/Export Errors**
- **Error**: `Unable to resolve module`
- **Fix**: Check file paths and imports
- **Common cause**: Missing file extensions or wrong relative paths

#### **Navigation Errors**
- **Error**: `Navigator.navigate is not a function`
- **Fix**: Ensure navigation is properly typed and imported
- **Check**: Navigation container is properly wrapped

#### **State Management Errors**
- **Error**: `Cannot read property of undefined`
- **Fix**: Check Zustand store initialization
- **Common cause**: Using store before it's initialized

#### **API/Network Errors**
- **Error**: `Network Error` or timeout
- **Fix**: Check if backend API is running
- **Development**: Ensure correct localhost URL in config

---

### Step-by-Step Debugging

#### **Step 1: Basic App Launch**
1. Start Metro bundler: `npx expo start --clear`
2. Check for compilation errors in terminal
3. Try opening on different platforms (iOS/Android/Web)

#### **Step 2: Isolate the Problem**
1. Comment out complex screens temporarily
2. Start with just basic navigation
3. Add screens back one by one

#### **Step 3: Check Error Boundary**
If the error boundary shows:
1. Look at the error message (in development mode)
2. Check the stack trace
3. Focus on the first line from your code (not node_modules)

#### **Step 4: Common Quick Fixes**
```bash
# 1. Clear all caches
npx expo start --clear
rm -rf node_modules && npm install

# 2. Reset Expo
expo r -c

# 3. Check package versions
npx expo install --fix

# 4. Restart Metro with fresh install
rm -rf node_modules .expo
npm install
npx expo start
```

---

### Current App State

#### **What's Working:**
- ✅ Metro bundler compiles successfully
- ✅ All imports and exports are correct
- ✅ Navigation structure is set up
- ✅ Error boundary is in place
- ✅ Basic screens are created

#### **Potential Issues:**
- ⚠️ API calls disabled (will show empty data)
- ⚠️ No backend server running
- ⚠️ Authentication may not work without API

#### **Safe Mode Configuration:**
The app is currently configured to work without the backend API:
- Dashboard shows empty state instead of crashing
- Authentication stores work but don't make real API calls
- All screens render properly

---

### Testing the App

#### **1. Test Basic Navigation**
1. App should start with Splash screen
2. After 2 seconds, navigate to Login screen
3. Try register/login forms (won't work without API, but should not crash)

#### **2. Test Error Handling**
1. If any errors occur, error boundary should catch them
2. Error details will show in development mode
3. Production mode shows friendly error message

#### **3. Enable API Integration**
When your Kinance API server is running:
1. Uncomment the API calls in `DashboardScreen.tsx`
2. Update the `BASE_URL` in `src/constants/config.ts` if needed
3. Test login/register functionality

---

### Getting Help

#### **Check These First:**
1. **Terminal output** - Look for red errors
2. **Expo Go logs** - Shake device for developer menu
3. **Console logs** - Check browser if using web version
4. **Network tab** - Check API requests if backend is running

#### **Common Debugging Commands:**
```bash
# Start with debugging enabled
npx expo start --dev-client

# Web version for easier debugging
npx expo start --web

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android

# Clean start
npx expo start --clear --dev-client
```

#### **Report Issues:**
When reporting issues, include:
1. Platform (iOS/Android/Web)
2. Error message from terminal
3. Error message from device/simulator
4. Steps to reproduce
5. Device/simulator details

---

### Recovery Steps

If the app is completely broken:

```bash
# Nuclear option - complete reset
rm -rf node_modules .expo
npm install
npx expo install --fix
npx expo start --clear
```

The app should now launch successfully! 🎉
