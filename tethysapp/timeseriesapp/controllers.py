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

#UPLOAD A CSV ##
def delete_old_observations():
    workspace_path = app.get_app_workspace().path
    uploaded_observations = glob.glob(os.path.join(workspace_path, 'observations', '*.csv'))
    expiration_time = datetime.datetime.now() - datetime.timedelta(days=1)
    for uploaded_observation in uploaded_observations:
        created_date = datetime.datetime.fromtimestamp(os.path.getctime(uploaded_observation))
        if created_date <= expiration_time:
            os.remove(uploaded_observation)
    return


def upload_new_observations(request):
    print("we are in the uploade_new_observations")
    delete_old_observations()
    workspace_path = app.get_app_workspace().path
    files = request.FILES
    print(files)
    responseObj={}
    for file in files:
        # new_observation_path = os.path.join(workspace_path, 'observations', files[file].name)
        new_observation_path = os.path.join(workspace_path, files[file].name)
        with open(new_observation_path, 'wb') as dst:
            for chunk in files[file].chunks():
                dst.write(chunk)
        try:
            df = pd.read_csv(new_observation_path)
            df.dropna(inplace=True)
            print(df)
        except Exception as e:
            JsonResponse(dict(error='Cannot read the csv provided. It may not be a valid csv file.'))
        try:
            df.datetime = pd.to_datetime(df.datetime)
            # df = df.resample('D', axis=0).mean()
            print(df)

        except Exception as e:
            JsonResponse(dict(error='Unable to recognize dates. Please specify 1 date/streamflow value pair per date. '
                                    'Recommended datetime format is YYYY-MM-DD HH:MM:SS'))
        try:
            print("hola")
            print(responseObj)
            # df.datetime = pd.to_datetime(df.datetime).tz_localize('UTC')
            print(df)
            dates = df['datetime'].tolist()
            values = df['streamflow (m^3/s)'].tolist()
            stationsIDs= df['stationID'].tolist()
            lats = df['lat'].tolist()
            longs = df['long'].tolist()
            # print(dates)
            # print(values)
            # print(stationsIDs)
            # print(lats)
            # print(longs)
            responseObj['dates']=dates
            responseObj['values'] = values
            responseObj['stationsIDs'] = stationsIDs
            responseObj['lats'] = lats
            responseObj['longs'] = longs
            print(responseObj)
        except Exception as e:
            pass

        df.to_csv(new_observation_path)

    # return JsonResponse(dict(new_file_list=list_uploaded_observations()))
    return JsonResponse(responseObj)
