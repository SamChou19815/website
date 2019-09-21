import os
import subprocess
from typing import Sequence


def get_changed_paths(base_ref: str, head_ref: str) -> Sequence[str]:
    return (
        subprocess.check_output(
            [
                "git",
                "diff",
                "--name-only",
                f"remotes/origin/{base_ref}",
                f"remotes/origin/{head_ref}",
            ]
        )
        .decode()
        .strip()
        .split("\n")
    )
