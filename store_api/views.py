import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Order, OrderItem, Product

SEED_PRODUCTS = [
    ("iPhone 15 Pro Max", "Apple", "iphone", 149900, "assets/iphone_15_pro_max_1776504783590.png", "Titanium. So strong. So light. So Pro."),
    ("MacBook Pro 16-inch", "Apple", "mac", 249900, "assets/macbook_pro_16_1776504808261.png", "Mind-blowing. Head-turning."),
    ("Apple Watch Ultra 2", "Apple", "watch", 89900, "assets/apple_watch_ultra_2_1776504829716.png", "Next level adventure."),
    ("Galaxy S24 Ultra", "Samsung", "iphone", 129999, "assets/galaxy_s24_ultra_1776504848463.png", "Epic, just like that."),
    ("Galaxy Watch 6", "Samsung", "watch", 36999, "assets/galaxy_watch_6_1776505256882.png", "The bezel is back."),
    ("Galaxy Z Fold 5", "Samsung", "iphone", 154999, "assets/galaxy_z_fold_5_1776504871435.png", "Unfold your world."),
]


def seed_products():
    if Product.objects.exists():
        return
    Product.objects.bulk_create(
        [
            Product(name=name, brand=brand, category=category, price=price, image=image, description=description)
            for name, brand, category, price, image, description in SEED_PRODUCTS
        ]
    )


def products(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    seed_products()
    category = request.GET.get("category")
    queryset = Product.objects.filter(category=category) if category else Product.objects.all()
    return JsonResponse({"products": [product.as_dict() for product in queryset]})


@csrf_exempt
def contact(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Request body must be valid JSON"}, status=400)
    required = ("name", "email", "topic", "message")
    if any(not str(payload.get(field, "")).strip() for field in required):
        return JsonResponse({"error": "name, email, topic, and message are required"}, status=400)
    return JsonResponse({"message": "Thanks. Our support team will be in touch shortly."}, status=201)


@csrf_exempt
def orders(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Request body must be valid JSON"}, status=400)

    items = payload.get("items", [])
    customer_name = str(payload.get("customerName", "")).strip()
    payment_method = str(payload.get("paymentMethod", "")).strip()
    if not customer_name or payment_method not in {"card", "upi"} or not items:
        return JsonResponse({"error": "customerName, paymentMethod, and items are required"}, status=400)

    product_ids = [item.get("productId") for item in items]
    products_by_id = {product.id: product for product in Product.objects.filter(id__in=product_ids)}
    if len(products_by_id) != len(set(product_ids)):
        return JsonResponse({"error": "One or more products were not found"}, status=400)

    normalized_items = []
    total = 0
    for item in items:
        product = products_by_id[item["productId"]]
        quantity = int(item.get("quantity", 0))
        if quantity < 1 or quantity > 99:
            return JsonResponse({"error": "Quantity must be between 1 and 99"}, status=400)
        total += product.price * quantity
        normalized_items.append((product, quantity))

    order = Order.objects.create(customer_name=customer_name, payment_method=payment_method, total=total, status="pending")
    OrderItem.objects.bulk_create([
        OrderItem(order=order, product=product, quantity=quantity, price=product.price)
        for product, quantity in normalized_items
    ])
    return JsonResponse({"orderId": order.id, "total": order.total, "status": order.status}, status=201)
