from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("store_api", "0004_airpods_image")]
    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("customer_name", models.CharField(max_length=120)),
                ("payment_method", models.CharField(max_length=20)),
                ("total", models.PositiveIntegerField()),
                ("status", models.CharField(choices=[("paid", "Paid"), ("pending", "Pending")], default="paid", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField()),
                ("price", models.PositiveIntegerField()),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="store_api.order")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="store_api.product")),
            ],
        ),
    ]