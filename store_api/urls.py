from django.urls import path

from .views import contact, orders, products

urlpatterns = [
    path("products/", products, name="products"),
    path("contact/", contact, name="contact"),
    path("orders/", orders, name="orders"),
]
