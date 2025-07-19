import pytest
from app.models.user import User
from app import db

# helpers

def register(client, username, email, password, is_admin=False):
    payload = {
        "username": username,
        "email": email,
        "password": password,
    }
    if is_admin:
        payload["is_admin"] = True
    return client.post("/api/register", json=payload)

def login(client, ue, pw):
    return client.post("/api/login", json={
        "username_or_email": ue,
        "password": pw
    })


# ─────────────── Auth Tests ───────────────

def test_register_missing_fields(client):
    rv = client.post("/api/register", json={"username": "joe"})
    assert rv.status_code == 400
    assert rv.get_json()["error"] == "Missing fields"

def test_register_duplicate_username_or_email(client):
    # first succeeds
    rv1 = register(client, "alice", "alice@test.com", "pw123")
    assert rv1.status_code == 201
    # duplicate fails
    rv2 = register(client, "alice", "alice@test.com", "pw123")
    assert rv2.status_code == 409
    assert "taken" in rv2.get_json()["error"]

def test_login_invalid_credentials(client):
    rv = login(client, "noone", "wrong")
    assert rv.status_code == 401
    assert rv.get_json()["error"] == "Invalid credentials"

def test_full_auth_flow_and_profile(client):
    # register
    rv = register(client, "carol", "carol@test.com", "pw456")
    assert rv.status_code == 201

    # login
    rv = login(client, "carol", "pw456")
    assert rv.status_code == 200
    data = rv.get_json()
    token = data["token"]
    user = data["user"]
    assert user["username"] == "carol"
    assert user["email"] == "carol@test.com"
    assert user["is_admin"] is False

    # fetch own profile
    rv = client.get("/api/user/profile",
        headers={"Authorization": f"Bearer {token}"})
    assert rv.status_code == 200
    prof = rv.get_json()
    assert prof["username"] == "carol"
    assert prof["email"] == "carol@test.com"
    assert prof["is_admin"] is False

# ────────────── Admin Tests ──────────────

def test_admin_list_and_single_and_toggle(client):
    # login as admin
    rv = login(client, "admin", "adminpw")
    token = rv.get_json()["token"]

    # list users
    rv = client.get("/api/admin/users",
        headers={"Authorization": f"Bearer {token}"})
    assert rv.status_code == 200
    users = rv.get_json()
    # should contain 'bob'
    bob = next(u for u in users if u["username"] == "bob")
    assert bob["is_admin"] is False

    # single fetch
    bob_id = bob["id"]
    rv = client.get(f"/api/admin/users/{bob_id}",
        headers={"Authorization": f"Bearer {token}"})
    assert rv.status_code == 200
    single = rv.get_json()
    assert single["username"] == "bob"

    # toggle admin status
    rv = client.patch(f"/api/admin/users/{bob_id}/toggle-admin",
        headers={"Authorization": f"Bearer {token}"})
    assert rv.status_code == 200
    assert "changed to True" in rv.get_json()["message"]

    # verify in DB
    with client.application.app_context():
        u = User.query.get(bob_id)
        assert u.is_admin is True

def test_non_admin_cannot_access_admin_routes(client):
    # login as bob (non-admin)
    rv = login(client, "bob", "bobpw")
    tok = rv.get_json()["token"]

    rv = client.get("/api/admin/users",
        headers={"Authorization": f"Bearer {tok}"})
    assert rv.status_code == 403
    assert rv.get_json()["error"] == "Admins only"

    rv = client.get("/api/admin/users/1",
        headers={"Authorization": f"Bearer {tok}"})
    assert rv.status_code == 403
