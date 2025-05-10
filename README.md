# Drinks: Track Your Sips & Stay Informed

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

Ever wondered how those drinks add up? **Drinks** is a modern, intuitive application designed to help you track your alcohol consumption, estimate your Blood Alcohol Content (BAC), and gain insights into your drinking patterns. Make informed decisions and understand your habits better!

## 🍺 Why Use Drinks?

- **Track Your Intake:** Easily log various types of drinks, from standard beers and wines to custom concoctions.
- **Estimate Your BAC:** Get a real-time estimation of your current BAC based on your logged drinks, weight, and gender.
- **Time to Sobriety:** See estimated times until your BAC returns to zero or a user-defined target level.
- **Understand Your Habits:** View statistics like average daily and weekly alcohol units consumed.
- **Identify Patterns:** Keep an eye on weeks or days where consumption might be higher than recommended guidelines.
- **Privacy-Focused:** Built with Jazz for secure, peer-to-peer data synchronization, keeping your data yours.

## ✨ Features

- **Intuitive Drink Logging:** Quickly add common drinks (beer, wine, shots) or create your own custom entries.
- **Real-time BAC Estimation:** Dynamic calculation of BAC as you add drinks.
- **Personalized Settings:** Adjust weight and gender for more accurate BAC estimations.
- **Target BAC Setting:** Define a personal BAC target and see how long until you reach it.
- **Consumption Statistics:**
    - Average daily and weekly units.
    - Number of weeks/days exceeding recommended limits.
- **Data Visualization:** Clear presentation of your current state and historical data (future enhancement).
- **Modern Tech Stack:** Built with React, TypeScript, and TailwindCSS for a smooth and responsive experience.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm (or pnpm/yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [<your-repository-url>](https://github.com/joeinnes/drinks.git)
    cd drinks
    ```

2.  **Install the dependencies:**
    ```bash
    pnpm install
    ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173` (or the port specified in your Vite config).

## 🛠️ Building for Production

Create a production-ready build:

```bash
pnpm run build
```

This will output the optimized static assets and server code into the `build/` directory.

## ⚠️ Disclaimer

**This application provides an *estimation* of Blood Alcohol Content (BAC) for informational and educational purposes only. It is NOT a substitute for official BAC testing devices (like a breathalyzer) and should NOT be used to determine if it is safe to drive or operate machinery.**

BAC can be affected by numerous factors including, but not limited to, individual metabolism, food intake, medication, health conditions, and hydration levels. The calculations used in this app are based on common formulas (e.g., Widmark formula) and may not perfectly reflect your actual BAC.

**Always drink responsibly. Do not rely on this application to make decisions about your ability to drive or engage in any activity that requires sobriety.** If you have concerns about your alcohol consumption, please consult a healthcare professional.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, please open an issue or submit a pull request.