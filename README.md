# Farmart

Farmart is a web-based platform that connects farmers, buyers, and administrators, enabling seamless transactions and management of farm products and orders. The project consists of a React frontend and a Python Flask backend.

## Features

- User authentication and registration (buyers, farmers, admins)
- Product (animal) listing and management
- Shopping cart and order placement
- Payment processing
- Admin dashboard for managing users and orders
- Email notifications

## Project Structure

```
Farmart/
├── client/        # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── public/
├── server/        # Flask backend
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── scripts/
│   ├── static/
│   └── tests/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.8+ and pip (for backend)

### Setup

#### Frontend

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

#### Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. (Optional) Create and activate a virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app/run.py
   ```

## Usage

- Access the frontend at `http://localhost:3000`
- The backend API runs at `http://localhost:5000` (default)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
