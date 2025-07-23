from app.models.order import Order
from app.utils.core_controllers import CoreController, CoreControllerOne

class OrderController(CoreController):
    def __init__(self):
        super().__init__(Order)

class OrderControllerOne(CoreControllerOne):
    def __init__(self):
        super().__init__(Order)