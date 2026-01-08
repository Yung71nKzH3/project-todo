# 🌋 Lava Lamp Todo

> A sleek, mindful task manager with a living background.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-violet.svg)

**Lava Lamp Todo** is a minimalist productivity app designed to be as calming as it is functional. It features a dynamic, fluid background that drifts gently while you focus on what matters.

## ✨ Features

*   **Mindful Design**: Glassmorphism UI floating over a soothing, animated lava lamp background.
*   **Zero-Friction**: Simple "Add and Check" workflow. No complex projects or tags.
*   **Native & Fast**: Runs as a lightweight native app on Windows and Linux (Fedora/Ubuntu).
*   **Privacy First**: All data is stored locally on your device. No clouds, no logins.

## 🚀 Installation

### Windows
1.  Go to the [Releases](../../releases) page.
2.  Download `project-todo_x.x.x_x64-setup.exe`.
3.  Run the installer.

### Linux (Fedora/RPM)
1.  Go to the [Releases](../../releases) page.
2.  Download the `.rpm` package.
3.  Install via DNF or Software Center:
    ```bash
    sudo dnf install ./project-todo_x.x.x_x86_64.rpm
    ```

## 🛠️ Development

Built with ❤️ using **React**, **Vite**, **Tailwind CSS v4**, and **Tauri v2**.

**Prerequisites**:
*   Node.js (v20+)
*   Rust (stable)

**Setup**:
1.  Clone the repo:
    ```bash
    git clone https://github.com/yourusername/project-todo.git
    cd project-todo
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run web dev server:
    ```bash
    npm run dev
    ```
4.  Run native dev app:
    ```bash
    npm run tauri dev
    ```

## 📦 Building

This project uses **GitHub Actions** to automatically build releases. Just push to `main` to trigger a new build.

To build manually:
```bash
npm run tauri build
```

---
*Created with Gemini Antigravity*
