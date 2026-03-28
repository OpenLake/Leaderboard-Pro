import json
import requests
import logging
from datetime import datetime, timedelta, timezone
from collections import defaultdict

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from leaderboard.models import (
    LeetcodeUser,
    UserNames,
    codeforcesUser,
    codeforcesUserRatingUpdate,
    UnifiedScoreHistory,
)

logger = logging.getLogger(__name__)

# ── helpers ───────────────────────────────────────────────────────────────────

def get_user_platforms(user):
    user_names = UserNames.objects.filter(user=user).order_by('id').first()
    if user_names is None:
        raise UserNames.DoesNotExist("User profile not found")
    return user_names


def date_range(start_date, end_date):
    current = start_date
    while current <= end_date:
        yield current
        current += timedelta(days=1)


# ── LeetCode Heatmap ──────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leetcode_heatmap(request):
    """
    Returns daily LeetCode submission counts for the last 6 months.
    Uses LeetCode public GraphQL API submissionCalendar field.
    Response: { username, heatmap: [{date, count}], range }
    """
    try:
        usernames = get_user_platforms(request.user)
        lt_username = usernames.lt_uname
        if not lt_username:
            return Response({"error": "LeetCode username not set."}, status=400)

        query = """
        query submissionCalendar($username: String!) {
            matchedUser(username: $username) {
                submissionCalendar
            }
        }
        """
        resp = requests.post(
            "https://leetcode.com/graphql",
            json={"query": query, "variables": {"username": lt_username}},
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data", {})
        matched = data.get("matchedUser")
        if matched is None:
            return Response({"error": "LeetCode user not found."}, status=404)
        raw = matched.get("submissionCalendar", "{}")
        calendar = json.loads(raw)  # { "unix_ts": count }

        today = datetime.now(tz=timezone.utc).date()
        cutoff = today - timedelta(days=180)

        date_map = {}
        for ts_str, count in calendar.items():
            d = datetime.utcfromtimestamp(int(ts_str)).date()
            if d >= cutoff:
                date_map[d.isoformat()] = count

        # fill every day in range with 0 if missing
        result = []
        for d in date_range(cutoff, today):
            key = d.isoformat()
            result.append({"date": key, "count": date_map.get(key, 0)})

        return Response({"username": lt_username, "heatmap": result, "range": "last_6_months"})

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except Exception:
        logger.exception("LeetCode heatmap generation failed")
        return Response({"error": "Failed to load LeetCode heatmap."}, status=500)


# ── LeetCode Line Chart ───────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leetcode_linechart(request):
    """
    Returns Easy / Medium / Hard cumulative solved counts.
    Current totals come from DB (LeetcodeUser).
    Response: { username, current_totals: {easy, medium, hard, total}, range }
    Frontend renders as a bar/line chart of difficulty breakdown.
    """
    try:
        usernames = get_user_platforms(request.user)
        lt_username = usernames.lt_uname
        if not lt_username:
            return Response({"error": "LeetCode username not set."}, status=400)

        lt_user = LeetcodeUser.objects.get(username=lt_username)

        current_totals = {
            "easy": lt_user.easy_solved,
            "medium": lt_user.medium_solved,
            "hard": lt_user.hard_solved,
            "total": lt_user.total_solved,
            "ranking": lt_user.ranking,
            "last_updated": lt_user.last_updated,
        }

        # Fetch submission calendar for full 180-day history
        query = """
        query submissionCalendar($username: String!) {
            matchedUser(username: $username) {
                submissionCalendar
            }
        }
        """
        resp = requests.post(
            "https://leetcode.com/graphql",
            json={"query": query, "variables": {"username": lt_username}},
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data", {})
        matched = data.get("matchedUser")
        if matched is None:
            return Response({"error": "LeetCode user not found."}, status=404)
        raw = matched.get("submissionCalendar", "{}")
        calendar = json.loads(raw)  # { "unix_ts": count }

        today = datetime.now(tz=timezone.utc).date()
        cutoff = today - timedelta(days=180)

        # Group by date — count of accepted submissions per day from calendar
        daily_counts = defaultdict(int)
        for ts_str, count in calendar.items():
            d = datetime.utcfromtimestamp(int(ts_str)).date()
            if d >= cutoff:
                daily_counts[d.isoformat()] = count

        timeline = [
            {"date": k, "count": v}
            for k, v in sorted(daily_counts.items())
        ]

        return Response({
            "username": lt_username,
            "current_totals": current_totals,
            "timeline": timeline,
            "range": "last_6_months",
        })

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except LeetcodeUser.DoesNotExist:
        return Response({"error": "LeetCode user not found in DB."}, status=404)
    except Exception:
        logger.exception("LeetCode line chart generation failed")
        return Response({"error": "Failed to load LeetCode chart."}, status=500)


# ── Codeforces Heatmap ────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codeforces_heatmap(request):
    """
    Returns contest activity for the last 12 weeks.
    Each day: rating_change > 0 → green, < 0 → red, 0 → grey (no contest).
    Uses Codeforces user.rating API (full contest history available).
    Response: { username, heatmap: [{date, rating_change, contest, rank}], range }
    """
    try:
        usernames = get_user_platforms(request.user)
        cf_username = usernames.cf_uname
        if not cf_username:
            return Response({"error": "Codeforces username not set."}, status=400)

        resp = requests.get(
            f"https://codeforces.com/api/user.rating?handle={cf_username}",
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("status") != "OK":
            return Response({"error": data.get("comment", "CF API error")}, status=502)

        today = datetime.now(tz=timezone.utc).date()
        cutoff = today - timedelta(weeks=12)

        contest_map = {}
        for contest in data["result"]:
            d = datetime.utcfromtimestamp(contest["ratingUpdateTimeSeconds"]).date()
            if d >= cutoff:
                contest_map[d.isoformat()] = {
                    "date": d.isoformat(),
                    "rating_change": contest["newRating"] - contest["oldRating"],
                    "new_rating": contest["newRating"],
                    "old_rating": contest["oldRating"],
                    "contest": contest["contestName"],
                    "rank": contest["rank"],
                }

        result = []
        for d in date_range(cutoff, today):
            key = d.isoformat()
            result.append(
                contest_map.get(key, {"date": key, "rating_change": 0, "contest": None})
            )

        return Response({"username": cf_username, "heatmap": result, "range": "last_12_weeks"})

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except Exception:
        logger.exception("Codeforces heatmap generation failed")
        return Response({"error": "Failed to load Codeforces heatmap."}, status=500)


# ── Codeforces Line Chart ─────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codeforces_linechart(request):
    """
    Returns full Codeforces rating history (all time by default).
    Supports ?range=3m|6m|1y|all  (default: all)
    Tries live CF API first, falls back to stored codeforcesUserRatingUpdate records.
    Response: { username, current_rating, max_rating, source, range, history }
    """
    try:
        usernames = get_user_platforms(request.user)
        cf_username = usernames.cf_uname
        if not cf_username:
            return Response({"error": "Codeforces username not set."}, status=400)

        range_param = request.query_params.get("range", "all")
        today = datetime.now(tz=timezone.utc).date()
        cutoff_map = {
            "3m": today - timedelta(days=90),
            "6m": today - timedelta(days=180),
            "1y": today - timedelta(days=365),
            "all": None,
        }
        cutoff = cutoff_map.get(range_param)

        # 1. Live CF API
        try:
            resp = requests.get(
                f"https://codeforces.com/api/user.rating?handle={cf_username}",
                timeout=10,
            )
            data = resp.json()
            if data.get("status") == "OK":
                history = []
                for c in data["result"]:
                    d = datetime.utcfromtimestamp(c["ratingUpdateTimeSeconds"]).date()
                    if cutoff and d < cutoff:
                        continue
                    history.append({
                        "date": d.isoformat(),
                        "rating": c["newRating"],
                        "old_rating": c["oldRating"],
                        "rating_change": c["newRating"] - c["oldRating"],
                        "contest": c["contestName"],
                        "rank": c["rank"],
                        "timestamp": c["ratingUpdateTimeSeconds"],
                    })
                cf_user = codeforcesUser.objects.get(username=cf_username)
                return Response({
                    "username": cf_username,
                    "current_rating": cf_user.rating,
                    "max_rating": cf_user.max_rating,
                    "source": "live",
                    "range": range_param,
                    "history": history,
                })
        except Exception:
            pass

        # 2. DB fallback
        cf_user = codeforcesUser.objects.get(username=cf_username)
        updates = codeforcesUserRatingUpdate.objects.filter(cf_user=cf_user).order_by("timestamp")
        history = []
        for u in updates:
            d = datetime.utcfromtimestamp(u.timestamp).date()
            if cutoff and d < cutoff:
                continue
            history.append({"date": d.isoformat(), "rating": u.rating, "timestamp": u.timestamp})

        return Response({
            "username": cf_username,
            "current_rating": cf_user.rating,
            "max_rating": cf_user.max_rating,
            "source": "stored",
            "range": range_param,
            "history": history,
        })

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except codeforcesUser.DoesNotExist:
        return Response({"error": "Codeforces user not found."}, status=404)
    except Exception:
        logger.exception("Codeforces line chart generation failed")
        return Response({"error": "Failed to load Codeforces chart."}, status=500)


# ── Unified Heatmap ───────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unified_heatmap(request):
    """
    Returns daily unified score change for the last 12 weeks.
    Data from UnifiedScoreHistory (written by daily Celery task).
    score_change > 0 → green, < 0 → red, 0 → grey.
    Response: { username, heatmap: [{date, total_score, score_change}], range }
    """
    try:
        usernames = get_user_platforms(request.user)
        # use whichever username is available as the key
        username = usernames.gh_uname or usernames.cf_uname or usernames.cc_uname or usernames.lt_uname
        if not username:
            return Response({"error": "No platform username set."}, status=400)

        today = datetime.now(tz=timezone.utc).date()
        cutoff = today - timedelta(weeks=12)

        records = UnifiedScoreHistory.objects.filter(
            username=username, date__gte=cutoff
        ).order_by("date")

        score_map = {r.date.isoformat(): r.total_score for r in records}

        result = []
        prev_score = None
        for d in date_range(cutoff, today):
            key = d.isoformat()
            if key in score_map:
                current = score_map[key]
                change = round(current - prev_score, 6) if prev_score is not None else 0.0
                prev_score = current
                result.append({"date": key, "total_score": round(current, 6), "score_change": change})
            else:
                result.append({"date": key, "total_score": prev_score or 0.0, "score_change": 0.0})

        return Response({
            "username": username,
            "heatmap": result,
            "range": "last_12_weeks",
            "note": "Data accumulates from deployment date onwards.",
        })

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except Exception:
        logger.exception("Unified heatmap generation failed")
        return Response({"error": "Failed to load unified heatmap."}, status=500)


# ── Unified Line Chart ────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unified_linechart(request):
    """
    Returns per-platform score breakdown over time from deployment onwards.
    Data from UnifiedScoreHistory.
    Response: { username, linechart: [{date, total, github, cf, cc, lt}] }
    """
    try:
        usernames = get_user_platforms(request.user)
        username = usernames.gh_uname or usernames.cf_uname or usernames.cc_uname or usernames.lt_uname
        if not username:
            return Response({"error": "No platform username set."}, status=400)

        records = UnifiedScoreHistory.objects.filter(username=username).order_by("date")

        result = [
            {
                "date": r.date.isoformat(),
                "total_score": round(r.total_score, 6),
                "github_score": round(r.github_score, 6),
                "cf_score": round(r.cf_score, 6),
                "cc_score": round(r.cc_score, 6),
                "lt_score": round(r.lt_score, 6),
            }
            for r in records
        ]

        return Response({
            "username": username,
            "linechart": result,
            "range": "from_deployment",
            "note": "Data available from deployment date onwards.",
        })

    except UserNames.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)
    except Exception:
        logger.exception("Unified line chart generation failed")
        return Response({"error": "Failed to load unified chart."}, status=500)
