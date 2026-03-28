import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .analytics import build_unified_ranking

logger = logging.getLogger(__name__)


class UnifiedAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            df = build_unified_ranking()
        except Exception:
            logger.exception("Unified ranking generation failed")
            return Response(
                {"detail": "Failed to load unified rankings."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if df.empty:
            return Response([])

        return Response(df.to_dict(orient="records"))
