from fnmatch import fnmatch
from .configuration import Project, get_projects
from typing import Sequence, List


def _is_affected(changed_paths: Sequence[str], relevant_paths: Sequence[str]) -> bool:
    for changed_path in changed_paths:
        for path_pattern in relevant_paths:
            if fnmatch(changed_path, path_pattern):
                return True
    return False


def is_affected(changed_paths: Sequence[str], project: Project) -> bool:
    return _is_affected(
        changed_paths=changed_paths, relevant_paths=project.relevant_paths
    )


def is_any_project_affected(changed_paths: Sequence[str]) -> bool:
    relevant_paths: List[str] = []
    for project in get_projects():
        relevant_paths.extend(project.relevant_paths)
    return _is_affected(changed_paths=changed_paths, relevant_paths=relevant_paths)
