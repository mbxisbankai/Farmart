import os, sys, pytest

# allow `import app` in tests
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    """Create a new Flask app and initialize a fresh in‑memory DB for each test."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        # turn off token expiry so tests don’t have to worry about timing
        "JWT_ACCESS_TOKEN_EXPIRES": False,
    })

    with app.app_context():
        db.create_all()
    yield app
    # teardown after each test
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    """Return a test client for our app."""
    return app.test_client()

@pytest.fixture(autouse=True)
def seed_users(app):
    """
    Before each test, seed exactly two users into the fresh DB:
      - admin@test.com (is_admin=True)
      - bob@test.com  (is_admin=False)
    """
    with app.app_context():
        # make sure we start with an empty table
        User.query.delete()
        admin = User(username="admin", email="admin@test.com", is_admin=True)
        admin.set_password("adminpw")
        bob   = User(username="bob",   email="bob@test.com",   is_admin=False)
        bob.set_password("bobpw")
        db.session.add_all([admin, bob])
        db.session.commit()
    yield
    # nothing to tear down here — the app fixture will drop_all()

