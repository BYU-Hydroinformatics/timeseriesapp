from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
from .app import Timeseriesapp as app
import glob, os, datetime
import pandas as pd
from django.http import JsonResponse

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

def geoserver_(request):
    """
    Controller for the app home page.
    """
    geoserverEndpoint = app.get_custom_setting('Geoserver Endpoint')
    geoserverWorkspace = app.get_custom_setting('Geoserver Workspace')
    context = {
        "endpoint": geoserverEndpoint,
        "workspace": geoserverWorkspace,
    }

    return render(request, 'timeseriesapp/geoserver.html', context)
