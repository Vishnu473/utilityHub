# 💡 Ideas Manager (React Native Expo App)

![Expo](https://img.shields.io/badge/Expo-49.0.6-blue)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/License-Personal%20Use-orange)

This app lets you create, view, edit, filter, sort, and manage your personal ideas.  
Built using **React Native**, **Expo**, and **TypeScript** with local storage via **MMKV**.

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

---

## 📂 Folder Structure (focused on Ideas)

app/
 ┣ tabs/ideasHome.tsx (Home screen for Ideas)
 ┣ ideas/
 ┃ ┣ addEditIdea.tsx (Add or edit an idea)
 ┃ ┗ [id].tsx (View individual idea)

components/
 ┣ ideas/
 ┃ ┣ activeIdeas.tsx (List active ideas)
 ┃ ┣ deletedIdeas.tsx (List deleted ideas)
 ┃ ┣ ideaItem.tsx (Single idea item)
 ┃ ┣ deleteIdeaItem.tsx (Deleted idea item)
 ┃ ┣ FilterSort/
 ┃ ┃ ┣ filterModal.tsx (Filter modal)
 ┃ ┃ ┣ filteredChip.tsx (Applied filters chip)
 ┃ ┃ ┗ sortDropDown.tsx (Sort dropdown)

hooks/
 ┣ useIdeas.ts (Manage all ideas)
 ┣ useDeletedIdeas.ts (Manage deleted ideas)
 ┣ useFilteredIdeas.ts (Manage filters)

storage/
 ┣ ideas/
 ┃ ┣ ideaSelectors.ts (Selectors for reading ideas)
 ┃ ┗ ideaService.ts (Service for adding, updating, deleting ideas)

utils/
 ┣ ideas/
 ┃ ┗ ideaFilterSort.ts (Filtering and sorting logic)

## 🚀 How to Run

```bash
npm install
npx expo start
```

Then scan the QR code using the **Expo Go app**.

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

This project is for personal use. No commercial license yet.