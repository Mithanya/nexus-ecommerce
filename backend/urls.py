from django.http import HttpResponseRedirect
from django.urls import include, path


def frontend(request):
    return HttpResponseRedirect("http://127.0.0.1:5173/")

urlpatterns = [
    path("", frontend, name="frontend"),
    path("api/", include("store_api.urls")),
]
