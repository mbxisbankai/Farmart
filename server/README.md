#Farmart

✅ What we've done (feature/backend-auth-admin)User model:

username, email, password_hash, is_admin

Password hashing & checking

Auth endpoints (routes/auth_routes.py → controllers/auth_controller.py):

POST /api/register → create user (optional is_admin flag)

POST /api/login → issue JWT + return user info

GET /api/user/profile → returns the currently logged‑in user

Admin endpoints (routes/admin_routes.py → controllers/admin_controller.py):

GET /api/admin/users → list all users

GET /api/admin/users/<id> → get one user’s details

PATCH /api/admin/users/<id>/toggle-admin → flip is_admin

JWT & access control:

flask_jwt_extended to create tokens and extract identity

@jwt_required() + custom @admin_required decorator

Database migrations:

Created users table

Added is_admin column

Increased password_hash length to 512

Automated tests (tests/test_auth.py + tests/conftest.py):

Covers registration, login, profile fetch

Covers admin listing, single fetch, toggle, and forbidden for non‑admins

Uses in‑memory SQLite and pytest fixtures for full isolation

