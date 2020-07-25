"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, re_path, include
from time import sleep


def sample_api_view(request):
    from django.http import JsonResponse

    sleep(2)
    return JsonResponse(
        {
            "message": """This message is coming from the backend.
                      The django view is inside `project/urls.py` and the redux code is in `react-app/src/js/welcome/(actions|reducers).js`.
                      Please remove them when starting your project :]"""
        }
    )


frontend_urls = [
    re_path(r"^.*$", TemplateView.as_view(template_name="frontend/index.html")),
]

# if you wish to test the PWA on dev, you need to remove this "if" statement,
# so that the urls are added. remember to built the frontend manually as well.
if not settings.DEBUG:
    frontend_urls.insert(0, path("", include("pwa.urls")))

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/sample-api-view/", sample_api_view),
] + frontend_urls
