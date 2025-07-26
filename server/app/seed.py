from app.extensions import db
from app.models.user import User
from app.models.farmer import Farmer
from app.models.animal import Animal
from app.models.cart import Cart
from app.models.order import Order
from app.models.payment import Payment
import random
from datetime import datetime, timedelta

def seed_database():
    """Seed the database with sample farm ecommerce data"""
    
    try:
        # Add missing relationship to User model if needed
        # Make sure User model has: farmer = db.relationship("Farmer", back_populates="user")
        # Make sure User model has: orders = db.relationship("Order", back_populates="user")
        
        print("Starting database seeding...")
        
        # Create sample users
        users_data = [
            {"username": "john_farmer", "email": "john@farmfresh.com", "password": "password123", "role": "farmer"},
            {"username": "mary_rancher", "email": "mary@greenacres.com", "password": "password123", "role": "farmer"},
            {"username": "bob_livestock", "email": "bob@livestockpro.com", "password": "password123", "role": "farmer"},
            {"username": "sarah_organic", "email": "sarah@organicfarm.com", "password": "password123", "role": "farmer"},
            {"username": "mike_dairy", "email": "mike@dairyville.com", "password": "password123", "role": "farmer"},
            {"username": "alice_customer", "email": "alice@email.com", "password": "password123", "role": "customer"},
            {"username": "david_buyer", "email": "david@email.com", "password": "password123", "role": "customer"},
            {"username": "emma_shopper", "email": "emma@email.com", "password": "password123", "role": "customer"},
            {"username": "james_customer", "email": "james@email.com", "password": "password123", "role": "customer"},
            {"username": "lisa_buyer", "email": "lisa@email.com", "password": "password123", "role": "customer"},
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password=user_data["password"],  # Uses the password setter
                role=user_data["role"]
            )
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        # Create farmers (first 5 users are farmers)
        farmers_data = [
            {"farm_name": "Green Valley Farm", "location": "Nakuru County, Kenya", "farm_type": "Mixed Farming"},
            {"farm_name": "Sunrise Ranch", "location": "Rift Valley, Kenya", "farm_type": "Livestock"},
            {"farm_name": "Heritage Livestock", "location": "Central Kenya", "farm_type": "Cattle & Poultry"},
            {"farm_name": "Organic Meadows", "location": "Kiambu County, Kenya", "farm_type": "Organic Livestock"},
            {"farm_name": "Dairy Hills Farm", "location": "Meru County, Kenya", "farm_type": "Dairy Farming"},
        ]
        
        farmers = []
        for i, farmer_data in enumerate(farmers_data):
            farmer = Farmer(
                user_id=users[i].id,
                farm_name=farmer_data["farm_name"],
                location=farmer_data["location"],
                farm_type=farmer_data["farm_type"]
            )
            farmers.append(farmer)
            db.session.add(farmer)
        
        db.session.commit()
        print(f"Created {len(farmers)} farmers")
        
        # Static image paths with multiple images per animal type
        cow_images = [
            "images/animals/cow1.jpg",
            "images/animals/cow2.jpg",
            "images/animals/cow3.jpg"
        ]

        bull_images = [
            "images/animals/bull1.jpg",
            "images/animals/bull2.jpg",
            "images/animals/bull3.jpg"
        ]

        chicken_images = [
            "images/animals/chicken1.jpg",
            "images/animals/chicken2.jpg",
            "images/animals/chicken3.jpg"
        ]

        # Optional: if you don't have heifer images, reuse cow images
        heifer_images = cow_images  # or define separately if you have them

        # Create animals
        animals_data = [
            # Green Valley Farm animals
            {"name": "Bella", "breed": "Holstein Friesian", "age": 3, "price": 45000.0, "type": "Cow"},
            {"name": "Max", "breed": "Ayrshire", "age": 4, "price": 42000.0, "type": "Bull"},
            {"name": "Luna", "breed": "Jersey", "age": 2, "price": 38000.0, "type": "Heifer"},
            {"name": "Charlie", "breed": "Rhode Island Red", "age": 1, "price": 500.0, "type": "Chicken"},
            
            # Sunrise Ranch animals
            {"name": "Thunder", "breed": "Boran", "age": 5, "price": 55000.0, "type": "Bull"},
            {"name": "Grace", "breed": "Sahiwal", "age": 3, "price": 47000.0, "type": "Cow"},
            {"name": "Storm", "breed": "Ankole", "age": 4, "price": 52000.0, "type": "Bull"},
            {"name": "Clucky", "breed": "Kienyeji", "age": 1, "price": 300.0, "type": "Chicken"},
            
            # Heritage Livestock animals
            {"name": "Duke", "breed": "Simmental", "age": 6, "price": 60000.0, "type": "Bull"},
            {"name": "Princess", "breed": "Guernsey", "age": 2, "price": 40000.0, "type": "Heifer"},
            {"name": "Rocky", "breed": "Brahman", "age": 7, "price": 65000.0, "type": "Bull"},
            {"name": "Henrietta", "breed": "Leghorn", "age": 1, "price": 450.0, "type": "Chicken"},
            
            # Organic Meadows animals
            {"name": "Rosie", "breed": "Brown Swiss", "age": 3, "price": 48000.0, "type": "Cow"},
            {"name": "Buddy", "breed": "Limousin", "age": 4, "price": 53000.0, "type": "Bull"},
            {"name": "Daisy", "breed": "Holstein", "age": 2, "price": 41000.0, "type": "Heifer"},
            {"name": "Pecky", "breed": "Sussex", "age": 1, "price": 400.0, "type": "Chicken"},
            
            # Dairy Hills Farm animals
            {"name": "Milo", "breed": "Friesian", "age": 5, "price": 56000.0, "type": "Bull"},
            {"name": "Bessie", "breed": "Jersey", "age": 3, "price": 44000.0, "type": "Cow"},
            {"name": "Hope", "breed": "Ayrshire", "age": 2, "price": 39000.0, "type": "Heifer"},
            {"name": "Feathers", "breed": "Australorp", "age": 1, "price": 350.0, "type": "Chicken"},
        ]
        
        animals = []
        animals_per_farmer = len(animals_data) // len(farmers)
        
        # Image selection logic
        image_map = {
            "Cow": cow_images,
            "Bull": bull_images,
            "Heifer": heifer_images,
            "Chicken": chicken_images
        }
        
        for i, animal_data in enumerate(animals_data):
            farmer_index = i // animals_per_farmer
            if farmer_index >= len(farmers):
                farmer_index = len(farmers) - 1
            
            # Select appropriate image based on animal type
            animal_type = animal_data["type"]
            picture_url = random.choice(image_map.get(animal_type, cow_images))
                
            animal = Animal(
                name=animal_data["name"],
                breed=animal_data["breed"],
                age=animal_data["age"],
                price=animal_data["price"],
                type=animal_data["type"],
                is_sold=random.choice([False, False, False, True]),  # 25% chance of being sold
                picture_url=picture_url,
                farmer_id=farmers[farmer_index].id
            )
            animals.append(animal)
            db.session.add(animal)
        
        db.session.commit()
        print(f"Created {len(animals)} animals")
        
        # Create some cart items (customers adding animals to cart)
        customer_users = users[5:]  # Last 5 users are customers
        available_animals = [a for a in animals if not a.is_sold]
        
        carts = []
        for customer in customer_users[:3]:  # First 3 customers have items in cart
            # Each customer adds 1-3 random animals to cart
            num_items = random.randint(1, 3)
            selected_animals = random.sample(available_animals, min(num_items, len(available_animals)))
            
            for animal in selected_animals:
                cart = Cart(
                    user_id=customer.id,
                    animal_id=animal.id
                )
                carts.append(cart)
                db.session.add(cart)
        
        db.session.commit()
        print(f"Created {len(carts)} cart items")
        
        # Create some orders
        orders_data = [
            {"user_id": users[6].id, "status": "completed", "total_amount": 45500.0},
            {"user_id": users[7].id, "status": "pending", "total_amount": 38300.0},
            {"user_id": users[8].id, "status": "completed", "total_amount": 52000.0},
        ]
        
        orders = []
        for order_data in orders_data:
            order = Order(
                user_id=order_data["user_id"],
                status=order_data["status"],
                total_amount=order_data["total_amount"],
                created_at=datetime.now() - timedelta(days=random.randint(1, 30))
            )
            orders.append(order)
            db.session.add(order)
        
        db.session.commit()
        print(f"Created {len(orders)} orders")
        
        # Create payments for completed orders
        payments = []
        for order in orders:
            if order.status == "completed":
                payment = Payment(
                    order_id=order.id,
                    user_id=order.user_id,
                    farmer_id=random.choice(farmers).id,
                    amount=order.total_amount,
                    method=random.choice(["M-Pesa", "Bank Transfer", "Cash"]),
                    status="paid",
                    created_at=order.created_at + timedelta(hours=2)
                )
                payments.append(payment)
                db.session.add(payment)
        
        db.session.commit()
        print(f"Created {len(payments)} payments")
        
        print("Database seeding completed successfully!")
        print(f"Summary:")
        print(f"- Users: {len(users)}")
        print(f"- Farmers: {len(farmers)}")
        print(f"- Animals: {len(animals)}")
        print(f"- Cart Items: {len(carts)}")
        print(f"- Orders: {len(orders)}")
        print(f"- Payments: {len(payments)}")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding database: {str(e)}")
        raise e
from app import create_app  # Make sure this is at the bottom or top

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_database()
