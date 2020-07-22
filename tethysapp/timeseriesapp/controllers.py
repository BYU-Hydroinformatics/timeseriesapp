from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button

@login_required()
def home(request):
    """
    Controller for the app home page.
    """


    context = {}

    return render(request, 'timeseriesapp/home.html', context)
def api_(request):
    """
    Controller for the app home page.
    """


    context = {}

    return render(request, 'timeseriesapp/API.html', context)
def csv_(request):
    """
    Controller for the app home page.
    """


    context = {}

    return render(request, 'timeseriesapp/csv.html', context)
def hydroshare_(request):
    """
    Controller for the app home page.
    """


    context = {}

    return render(request, 'timeseriesapp/hydroshare.html', context)
