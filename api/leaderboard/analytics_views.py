from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .analytics import build_unified_ranking


class UnifiedAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        df = build_unified_ranking()

        if df.empty:
            return Response([])

        return Response(df.to_dict(orient="records"))