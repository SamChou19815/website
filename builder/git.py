import os
import subprocess
from typing import Sequence


def get_changed_paths(base_ref: str, head_ref: str) -> Sequence[str]:
    return (
        subprocess.check_output(["git", "diff", "--name-only", base_ref, head_ref])
        .decode()
        .strip()
        .split("\n")
    )


def get_depth(path: str, depth: int = 0) -> int:
    if not os.path.isdir(path):
        return depth
    try:
        subprocess.check_output(
            ["git", "ls-files", "--error-unmatch", path], stderr=subprocess.DEVNULL
        )
    except Exception:
        # Do not consider gitignored files.
        return depth
    max_depth = depth
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        max_depth = max(max_depth, get_depth(full_path, depth + 1))
    return max_depth
