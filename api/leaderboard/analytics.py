import pandas as pd

from models import (
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
        return df

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
        return df

    df = df.fillna(0)

    # Ranking: lower is better → invert
    if "ranking" in df:
        df["ranking_inv"] = df["ranking"].max() - df["ranking"]
        df["ranking_norm"] = safe_normalize(df["ranking_inv"])
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
        return df

    df = df.fillna(0)

    df["rating_norm"] = safe_normalize(df.get("rating", 0))
    df["max_rating_norm"] = safe_normalize(df.get("max_rating", 0))
    df["solved_norm"] = safe_normalize(df.get("total_solved", 0))

    # Submission efficiency
    df["efficiency"] = df.get("total_solved", 0) / (
        df.get("total_submissions", 1)
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
        return df

    df = df.fillna(0)

    df["rating_norm"] = safe_normalize(df.get("rating", 0))
    df["max_rating_norm"] = safe_normalize(df.get("max_rating", 0))

    # Global rank inversion (lower better)
    if "Global_rank" in df:
        df["Global_rank"] = pd.to_numeric(df["Global_rank"], errors="coerce").fillna(0)
        df["rank_inv"] = df["Global_rank"].max() - df["Global_rank"]
        df["rank_norm"] = safe_normalize(df["rank_inv"])
    else:
        df["rank_norm"] = 0

    df["cc_score"] = (
        0.5 * df["rating_norm"] +
        0.3 * df["max_rating_norm"] +
        0.2 * df["rank_norm"]
    )

    return df[["username", "cc_score"]]

def build_unified_ranking():
    df_github, df_cf, df_cc, df_lt = load_dataframes()

    g = github_score(df_github)
    c = codeforces_score(df_cf)
    cc = codechef_score(df_cc)
    lt = leetcode_score(df_lt)

    # Merge progressively
    df = g.merge(c, on="username", how="outer") \
          .merge(cc, on="username", how="outer") \
          .merge(lt, on="username", how="outer")

    df = df.fillna(0)

    df["total_score"] = (
        df.get("github_score", 0) +
        df.get("cf_score", 0) +
        df.get("cc_score", 0) +
        df.get("lt_score", 0)
    )

    df["rank"] = df["total_score"].rank(ascending=False)

    return df.sort_values("rank")