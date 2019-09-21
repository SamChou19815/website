from dataclasses import dataclass
from typing import Sequence
from .workspace import get_dependency_chain


@dataclass
class Project:
    workspace: str
    build_command: str
    build_output: str
    relevant_paths: Sequence[str]


def _create_project(
    workspace: str,
    build_command: str,
    build_output: str,
    additional_dependency_paths: Sequence[str],
) -> Project:
    relevant_paths: Sequence[str] = [
        *[f"{dependency}/**" for dependency in get_dependency_chain(workspace)],
        *additional_dependency_paths,
    ]
    return Project(
        workspace=workspace,
        build_command=build_command,
        build_output=build_output,
        relevant_paths=relevant_paths,
    )


def create_yarn_workspace_project(workspace: str) -> Project:
    return _create_project(
        workspace=workspace,
        build_command=f"yarn workspace {workspace} build",
        build_output=f"{workspace}/build",
        additional_dependency_paths=["package.json", "yarn.lock", "configuration/**"],
    )


def get_projects() -> Sequence[Project]:
    workspaces = [
        "blog",
        "main-site-frontend",
        "samlang-demo-frontend",
        "samlang-docs",
        "ten-web-frontend",
    ]
    return [
        create_yarn_workspace_project(workspace=workspace) for workspace in workspaces
    ]
