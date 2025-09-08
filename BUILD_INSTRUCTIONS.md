# Development Build Instructions

## 🎯 **Current Status**: App works with Expo Go!

The app is currently running successfully in Expo Go. For most development purposes, this is sufficient.

## 🚀 **Quick Start (Recommended)**

### Use Expo Go
1. **iOS**: Open Camera app → Scan QR code
2. **Android**: Open Expo Go app → Scan QR code
3. **Start development server**:
   ```bash
   npx expo start --go
   ```

---

## 🏗️ **Development Build (Advanced)**

If you need native functionality or want a standalone app:

### **Option 1: Local Build (Free)**

**Prerequisites:**
- Xcode (for iOS)
- Android Studio (for Android)
- Apple Developer Account (for iOS device testing)

**iOS Local Build:**
```bash
# Build for iOS Simulator
npx expo run:ios

# Build for iOS Device (requires Apple Developer Account)
npx expo run:ios --device
```

**Android Local Build:**
```bash
# Build for Android Emulator
npx expo run:android

# Build for Android Device
npx expo run:android --device
```

### **Option 2: Cloud Build (EAS)**

**Setup EAS:**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
npx eas login

# Configure project
npx eas build:configure
```

**Build Commands:**
```bash
# iOS Development Build
npx eas build --platform ios --profile development

# Android Development Build  
npx eas build --platform android --profile development

# Both platforms
npx eas build --profile development
```

---

## 📱 **Installing Development Build**

### **iOS:**
1. Cloud build → Install via TestFlight or direct download
2. Local build → Drag .app to iOS Simulator or install via Xcode

### **Android:**
1. Cloud build → Download .apk and install
2. Local build → Install .apk via `adb install`

---

## 🔧 **Configuration**

The app is already configured with:
- ✅ `expo-dev-client` installed
- ✅ Proper app.json configuration
- ✅ Bundle identifiers set

### **app.json Configuration:**
```json
{
  "expo": {
    "name": "kinance-mobile",
    "slug": "kinance-mobile", 
    "ios": {
      "bundleIdentifier": "com.anonymous.kinancemobile"
    },
    "android": {
      "package": "com.anonymous.kinancemobile"
    }
  }
}
```

---

## 🚦 **When to Use Each Option**

### **Expo Go (Current Setup)**
✅ **Use for:**
- Development and testing
- Quick iterations
- Debugging
- Most React Native features

❌ **Don't use for:**
- Custom native modules
- Production testing
- App store submission

### **Development Build**
✅ **Use for:**
- Custom native dependencies
- Production-like testing
- Push notifications
- Camera/file system access
- App store submission prep

---

## 🐛 **Troubleshooting Development Builds**

### **Common Issues:**

**iOS Build Fails:**
```bash
# Clear Xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData

# Update Xcode and command line tools
sudo xcode-select --install
```

**Android Build Fails:**
```bash
# Clear Android cache
cd android
./gradlew clean
cd ..

# Reset Metro cache
npx expo start --clear
```

**EAS Build Fails:**
```bash
# Check build logs in Expo dashboard
# Update dependencies
npx expo install --fix
```

---

## 📋 **Next Steps**

1. **For now**: Keep using Expo Go for development
2. **When needed**: Create development build using local or EAS build
3. **For production**: Use EAS Build for app store submission

---

## 💡 **Tips**

- **Development**: Expo Go is fastest for iteration
- **Testing**: Development build for production-like testing  
- **Distribution**: EAS Build for internal testing and app stores
- **Debugging**: Expo Go has the best debugging experience

The app is working perfectly with Expo Go! 🎉
