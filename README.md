# 💡 Ideas Manager (React Native Expo App)

![Expo](https://img.shields.io/badge/Expo-49.0.6-blue)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/License-Personal%20Use-orange)

This app lets you create, view, edit, filter, sort, and manage your personal ideas.  
Built using **React Native**, **Expo**, and **TypeScript** with local storage via **MMKV**.

You can Download the latest [APK here](https://drive.google.com/drive/folders/1szm5TXLnS00ZzmAlvZJXexT5nWc2AO7z?usp=drive_link).    
Use at your own risk. APK is provided for personal testing purposes.

🚧 Vault and AskAI features are under development.  
Currently, the app focuses on the **Ideas** feature.

---

## ✨ Features (Ideas)

- Add new ideas with title, purpose, category, description, and tools.
- Edit existing ideas.
- Soft delete ideas (move to deleted ideas tab).
- Restore or permanently delete ideas.
- Filter ideas by title, purpose, description, category, or tools.
- Sort ideas by created date and category.

Of course! Here’s a full **Project Setup** guide with your provided commands integrated, written cleanly for easy understanding:

---

## 📋 Project Setup Guide

### Prerequisites

Make sure you have the following installed before starting:

- **Node.js** (version 18.x or later recommended)  
  [Download Node.js](https://nodejs.org/)

- **npm** (comes with Node.js)

- **Expo CLI**  
  Install it globally if not already installed:
  ```bash
  npm install -g expo-cli
  ```

- **Expo Go App** (on your mobile device)  
  [Download for Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [Download for iOS](https://apps.apple.com/app/expo-go/id982107779)

---

### 🛠️ Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone https://github.com/Vishnu473/utilityHub.git
   cd utilityHub
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

---

### 🚀 How to Run

To start the project locally:

```bash
npx expo start
```

- A new tab will open in your browser showing the **Metro Bundler**.
- Scan the QR code using the **Expo Go app** on your phone.

---

### ⚙️ Additional Setup Tips

- **If you're using an emulator** (Android Studio or iOS Simulator):
  - Make sure the emulator is running.
  - Press `a` (for Android) or `i` (for iOS) in the terminal after `expo start`.

- **If you face any issues**:
  - Try clearing the cache:
    ```bash
    npx expo start -c
    ```
  - Ensure your phone and computer are connected to the **same Wi-Fi network**.

---

# 🛠 Tech Stack

- React Native (Expo)
- TypeScript
- MMKV Storage
- Tailwind CSS (if you used it)
- React Navigation

---

## 🔥 Upcoming Features

- 🔒 Vault (Save passwords securely)
- 🤖 AskAI (Ask your saved AI assistant questions)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).
