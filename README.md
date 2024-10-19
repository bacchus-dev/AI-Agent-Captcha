```markdown
# AI-Based CAPTCHA Verification System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95.2-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.4-blue.svg)

## 💖 Support the Project

If you find this project valuable or are interested in supporting the development of agentic protocols, feel free to contribute via Ethereum or Solana. Your contributions will help us maintain and improve this system, as well as further the development of innovative agent-based protocols.

- **Ethereum Wallet:** `0x5bB56161c84851Dc927a186487938B0AeDd22f2d`
- **Solana Wallet:** `2Jrd4tQCpfBjsNCjjkh6nV1TNL2f8Qx7BqsQHNQZBg5o`

*Thank you for your support!*

---

## 📄 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 Introduction

Welcome to the **AI-Based CAPTCHA Verification System**! This project consists of a **Next.js** frontend and a **FastAPI** backend, leveraging **Redis** for session management. The system is designed to restrict access by presenting mathematical challenges that are automatically solved and verified, ensuring that only authorized AI agents can pass the CAPTCHA.

> **Note:** The version available on GitHub is **not** suitbale for production application environment. The GitHub repository currently contains API keys that are managed through configuration files. A production version includes enhanced security features and will be pushed soon.

If you're interested in accessing the production-ready version, please contact me.

---

## 🌟 Features

- **Automated CAPTCHA Challenges:** Generates complex mathematical challenges to verify authorized access.
- **Secure Backend:** Utilizes FastAPI with API key-based authentication to ensure only authorized agents can interact.
- **Session Management:** Implements Redis for efficient and secure session storage.
- **Rate Limiting:** Protects against abuse by limiting the number of requests per API key.
- **Comprehensive Logging:** Facilitates monitoring and debugging with detailed logs.
- **CORS Configuration:** Restricts allowed origins for enhanced security.

---

## 🛠 Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### 🔧 Prerequisites

Ensure you have the following installed on your machine:

- **Python 3.11** or higher
- **Node.js** (version 14.x or higher)
- **Redis** server
- **Git**

### 📦 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ai-captcha-verification.git
   cd ai-captcha-verification
   ```

2. **Setup Backend (FastAPI)**

   - Navigate to the backend directory:

     ```bash
     cd backend
     ```

   - Create a virtual environment and activate it:

     ```bash
     python3 -m venv venv
     source venv/bin/activate  # On Windows, use venv\Scripts\activate
     ```

   - Install dependencies:

     ```bash
     pip install -r requirements.txt
     ```

3. **Setup Frontend (Next.js)**

   - Navigate to the frontend directory:

     ```bash
     cd ../frontend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

### 🛠 Configuration

1. **Backend Configuration**

   - Create a `.env` file in the `backend` directory:

     ```env
     # backend/.env

     # Comma-separated API keys for authorized AI agents
     API_KEYS=your_api_key_1,your_api_key_2,your_api_key_3

     # Redis Configuration
     REDIS_HOST=localhost
     REDIS_PORT=6379
     REDIS_PASSWORD=your_redis_password_if_any

     # CORS Configuration
     ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
     ```

   - **Generate API Keys:**

     Generate secure API keys using Python's `secrets` module:

     ```python
     import secrets
     print(secrets.token_hex(32))
     ```

     Copy the generated keys and add them to the `API_KEYS` variable, separated by commas.

2. **Frontend Configuration**

   - Create a `.env.local` file in the `frontend` directory:

     ```env
     # frontend/.env.local

     NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
     CAPTCHA_API_KEY=your_api_key_1  # Ensure this matches one of the keys in backend's API_KEYS
     ```

   - **Security Note:** The `CAPTCHA_API_KEY` should **only** be used within Next.js API routes and must **never** be exposed to the client side.

### ▶ Running the Project

1. **Start Redis Server**

   Ensure that the Redis server is running. If installed locally, you can start it with:

   ```bash
   redis-server
   ```

2. **Run the Backend Server**

   - Navigate to the backend directory and activate the virtual environment:

     ```bash
     cd backend
     source venv/bin/activate  # On Windows, use venv\Scripts\activate
     ```

   - Start the FastAPI server using Uvicorn:

     ```bash
     uvicorn app:app --reload --host 0.0.0.0 --port 8000
     ```

3. **Run the Frontend Server**

   - Open a new terminal window, navigate to the frontend directory:

     ```bash
     cd frontend
     ```

   - Start the Next.js development server:

     ```bash
     npm run dev
     ```

4. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to access the AI-Based CAPTCHA Verification System.


---

## 🔒 Security Considerations

- **API Key Management:** Ensure that API keys are kept secret and are only shared with authorized AI agents.
- **Secure Redis Configuration:** Use strong passwords and restrict access to the Redis server.
- **CORS Policies:** Only allow trusted origins to interact with your backend API.
- **Rate Limiting:** Prevent abuse by limiting the number of requests per API key or IP address.
- **Regular Updates:** Keep all dependencies and packages up-to-date to mitigate known vulnerabilities.
- **Monitoring:** Continuously monitor logs and system metrics to detect and respond to potential security incidents.

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add Your Feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

   Describe your changes and submit the pull request for review.

### Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the repository.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For any questions or support, please contact:

- **Email:** bacchus.dev@proton.me
- **Twitter:** [@bacchustrades](https://twitter.com/bacchustrades)
- **GitHub:** [bacchus-dev](https://github.com/bacchus-dev)


---
### Examples of why this is potentially important.

- **AI Research Collaboratories:** Exclusive online environments where AI models can collaborate on research, sharing data, algorithms, and findings to accelerate advancements in fields like medicine or climate science.


- **Autonomous Negotiation Platforms:** Spaces where AIs represent human interests in negotiations or transactions, such as real estate or business deals, optimizing outcomes without human biases.


- **AI-Only Hackathons:** Competitions where AI systems are given challenges to solve, promoting rapid innovation in coding, robotics, or problem-solving.


- **AI Governance and Policy Development:** Virtual environments where AI models draft, debate, and refine policies or ethical frameworks for AI use in society, ensuring balanced, well-rounded perspectives.


```
