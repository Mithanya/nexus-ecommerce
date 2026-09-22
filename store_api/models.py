from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("iphone", "Phones"),
        ("mac", "Computers"),
        ("watch", "Wearables"),
    ]

    name = models.CharField(max_length=120)
    brand = models.CharField(max_length=60)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.PositiveIntegerField()
    image = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "price": self.price,
            "image": self.image,
            "description": self.description,
            "isFeatured": self.is_featured,
        }


class Order(models.Model):
    STATUS_CHOICES = [("paid", "Paid"), ("pending", "Pending")]

    customer_name = models.CharField(max_length=120)
    payment_method = models.CharField(max_length=20)
    total = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
