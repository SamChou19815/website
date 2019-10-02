from fnmatch import fnmatch
from .configuration import Project
from typing import Sequence


def is_affected(changed_paths: Sequence[str], project: Project) -> bool:
    for changed_path in changed_paths:
        for path_pattern in project.relevant_paths:
            if fnmatch(changed_path, path_pattern):
                return True
    return False
