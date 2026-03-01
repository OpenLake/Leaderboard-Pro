from rest_framework.views import APIView
from rest_framework.response import Response
from leaderboard.analytics import build_unified_ranking

class UnifiedAnalyticsView(APIView):
    def get(self, request):
        df = build_unified_ranking()

        if df.empty:
            return Response([])

        return Response(df.to_dict(orient="records"))