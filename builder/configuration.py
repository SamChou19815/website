from dataclasses import dataclass
from typing import Sequence
from .workspace import get_dependency_chain


@dataclass
class Project:
    workspace: str
    relevant_paths: Sequence[str]


def _create_project(
    workspace: str, additional_dependency_paths: Sequence[str]
) -> Project:
    relevant_paths: Sequence[str] = [
        *[f"{dependency}/**" for dependency in get_dependency_chain(workspace)],
        *additional_dependency_paths,
    ]
    return Project(workspace=workspace, relevant_paths=relevant_paths)


def create_yarn_workspace_project(workspace: str) -> Project:
    return _create_project(
        workspace=workspace,
        additional_dependency_paths=[
            "package.json",
            "yarn.lock",
            "configuration/**",
            f".github/workflows/generated-*-{workspace}.yml",
        ],
    )


def get_projects() -> Sequence[Project]:
    return [
        create_yarn_workspace_project(workspace="blog"),
        create_yarn_workspace_project(workspace="samlang"),
        create_yarn_workspace_project(workspace="samlang-demo"),
        create_yarn_workspace_project(workspace="ten"),
        create_yarn_workspace_project(workspace="www"),
    ]
