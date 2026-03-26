import pandas as pd

from .models import (
    githubUser,
    codeforcesUser,
    codechefUser,
    LeetcodeUser,
)

def load_dataframes():
    df_github = pd.DataFrame(list(githubUser.objects.all().values()))
    df_cf = pd.DataFrame(list(codeforcesUser.objects.all().values()))
    df_cc = pd.DataFrame(list(codechefUser.objects.all().values()))
    df_lt = pd.DataFrame(list(LeetcodeUser.objects.all().values()))

    return df_github, df_cf, df_cc, df_lt

def safe_normalize(series):
    if series.empty:
        return series

    if series.max() == series.min():
        return series * 0

    return (series - series.min()) / (series.max() - series.min())

def github_score(df):
    if df.empty:
        return pd.DataFrame(columns=["username", "github_score"])

    df = df.fillna(0)

    df["repo_norm"] = safe_normalize(df["repositories"])
    df["stars_norm"] = safe_normalize(df["stars"])
    df["contrib_norm"] = safe_normalize(df["contributions"])

    df["github_score"] = (
        0.3 * df["repo_norm"] +
        0.4 * df["stars_norm"] +
        0.3 * df["contrib_norm"]
    )

    return df[["username", "github_score"]]

def leetcode_score(df):
    if df.empty:
        return pd.DataFrame(columns=["username", "lt_score"])

    df = df.fillna(0)

    # Ranking: lower is better → invert
    if "ranking" in df.columns:
        ranking = df["ranking"].replace(0, pd.NA).astype("float")
        df["ranking_inv"] = ranking.max() - ranking
        df["ranking_norm"] = safe_normalize(df["ranking_inv"].fillna(0))
    else:
        df["ranking_norm"] = 0

    # Problem difficulty weighted
    df["difficulty_score"] = (
        df.get("easy_solved", 0) * 1 +
        df.get("medium_solved", 0) * 2 +
        df.get("hard_solved", 0) * 3
    )

    df["difficulty_norm"] = safe_normalize(df["difficulty_score"])
    df["total_norm"] = safe_normalize(df.get("total_solved", 0))

    df["lt_score"] = (
        0.4 * df["difficulty_norm"] +
        0.3 * df["total_norm"] +
        0.3 * df["ranking_norm"]
    )

    return df[["username", "lt_score"]]

def codeforces_score(df):
    if df.empty:
        return pd.DataFrame(columns=["username", "cf_score"])

    df = df.fillna(0)

    df["rating_norm"] = safe_normalize(df.get("rating", 0))
    df["max_rating_norm"] = safe_normalize(df.get("max_rating", 0))
    df["solved_norm"] = safe_normalize(df.get("total_solved", 0))

    # Submission efficiency
    df["efficiency"] = df.get("total_solved", 0) / (
        df.get("total_submissions", 1).replace(0, 1)
    )
    df["efficiency_norm"] = safe_normalize(df["efficiency"])

    df["cf_score"] = (
        0.4 * df["rating_norm"] +
        0.2 * df["max_rating_norm"] +
        0.2 * df["solved_norm"] +
        0.2 * df["efficiency_norm"]
    )

    return df[["username", "cf_score"]]

def codechef_score(df):
    if df.empty:
        return pd.DataFrame(columns=["username", "cc_score"])

    df = df.fillna(0)

    df["rating_norm"] = safe_normalize(df.get("rating", 0))
    df["max_rating_norm"] = safe_normalize(df.get("max_rating", 0))

    # Global rank inversion (lower better)
    if "Global_rank" in df.columns:
        global_rank = pd.to_numeric(df["Global_rank"], errors="coerce")
        global_rank = global_rank.replace(0, pd.NA).astype("float")
        df["rank_inv"] = global_rank.max() - global_rank
        df["rank_norm"] = safe_normalize(df["rank_inv"].fillna(0))
    else:
        df["rank_norm"] = 0

    df["cc_score"] = (
        0.5 * df["rating_norm"] +
        0.3 * df["max_rating_norm"] +
        0.2 * df["rank_norm"]
    )

    return df[["username", "cc_score"]]

def build_unified_ranking():
    from leaderboard.models import UserNames

    # Get all users who have set at least one platform username
    user_mappings = UserNames.objects.select_related("user").all()

    if not user_mappings.exists():
        return pd.DataFrame()

    df_github, df_cf, df_cc, df_lt = load_dataframes()

    # Index each platform df by username for fast lookup
    gh_idx = df_github.set_index("username") if not df_github.empty else pd.DataFrame()
    cf_idx = df_cf.set_index("username") if not df_cf.empty else pd.DataFrame()
    cc_idx = df_cc.set_index("username") if not df_cc.empty else pd.DataFrame()
    lt_idx = df_lt.set_index("username") if not df_lt.empty else pd.DataFrame()

    # Compute per-platform scores
    g  = github_score(df_github).set_index("username") if not df_github.empty else pd.DataFrame(columns=["github_score"])
    c  = codeforces_score(df_cf).set_index("username") if not df_cf.empty else pd.DataFrame(columns=["cf_score"])
    cc = codechef_score(df_cc).set_index("username") if not df_cc.empty else pd.DataFrame(columns=["cc_score"])
    lt = leetcode_score(df_lt).set_index("username") if not df_lt.empty else pd.DataFrame(columns=["lt_score"])

    rows = []
    for mapping in user_mappings:
        row = {
            "user_id": mapping.user.id,
            "display_name": mapping.user.username,  # app-level username
            "gh_uname": mapping.gh_uname,
            "cf_uname": mapping.cf_uname,
            "cc_uname": mapping.cc_uname,
            "lt_uname": mapping.lt_uname,
            "github_score": float(g.loc[mapping.gh_uname,  "github_score"]) if mapping.gh_uname  in g.index  else 0.0,
            "cf_score": float(c.loc[mapping.cf_uname,  "cf_score"])     if mapping.cf_uname  in c.index  else 0.0,
            "cc_score": float(cc.loc[mapping.cc_uname, "cc_score"])     if mapping.cc_uname  in cc.index else 0.0,
            "lt_score": float(lt.loc[mapping.lt_uname, "lt_score"])     if mapping.lt_uname  in lt.index else 0.0,
        }
        row["total_score"] = (
            row["github_score"] +
            row["cf_score"] +
            row["cc_score"] +
            row["lt_score"]
        )
        rows.append(row)

    df = pd.DataFrame(rows)

    if df.empty:
        return pd.DataFrame(columns=["user_id", "display_name", "gh_uname", "cf_uname", "cc_uname", "lt_uname", "github_score", "cf_score", "cc_score", "lt_score", "total_score", "rank"])

    df["rank"] = df["total_score"].rank(ascending=False, method="min")

    return df.sort_values("rank")