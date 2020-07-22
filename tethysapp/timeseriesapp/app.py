from tethys_sdk.base import TethysAppBase, url_map_maker


class Timeseriesapp(TethysAppBase):
    """
    Tethys app class for Timeseriesapp.
    """

    name = 'Timeseriesapp'
    index = 'timeseriesapp:home'
    icon = 'timeseriesapp/images/dogo_logo.png'
    package = 'timeseriesapp'
    root_url = 'timeseriesapp'
    color = '#000000'
    description = '"demo app for timeseries"'
    tags = '"demo","BYU", "Hackaton"'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='timeseriesapp',
                controller='timeseriesapp.controllers.home'
            ),
            UrlMap(
                name='api',
                url='timeseriesapp/api',
                controller='timeseriesapp.controllers.api_'
            ),
            UrlMap(
                name='csv',
                url='timeseriesapp/csv',
                controller='timeseriesapp.controllers.csv_'
            ),
            UrlMap(
                name='hydroshare',
                url='timeseriesapp/hydroshare',
                controller='timeseriesapp.controllers.hydroshare_'
            ),
        )

        return url_maps
