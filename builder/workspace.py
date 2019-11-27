import functools
import json
import subprocess

from dataclasses import dataclass
from typing import Mapping, List, Sequence, Set


@dataclass
class WorkspaceInformation:
    location: str
    dependencies: Sequence[str]


@functools.lru_cache(maxsize=1)
def _get_workspaces_information_from_yarn() -> Mapping[str, WorkspaceInformation]:
    workspaces_json = json.loads(
        subprocess.check_output(
            ["yarn", "workspaces", "info", "--silent"], stderr=subprocess.DEVNULL
        ).decode()
    )
    return {
        workspace_name: WorkspaceInformation(
            location=workspace_information["location"],
            dependencies=workspace_information["workspaceDependencies"],
        )
        for workspace_name, workspace_information in workspaces_json.items()
    }


def _get_workspace_information(
    workspaces: Mapping[str, WorkspaceInformation], workspace: str
) -> WorkspaceInformation:
    information = workspaces.get(workspace)
    if information is None:
        raise Exception(f"Workspace {workspace} is not found!")
    return information


def _construct_dependency_chain(
    workspaces: Mapping[str, WorkspaceInformation],
    workspace: str,
    dependency_chain: List[str],
    parent_chain: List[str],
    parent_set: Set[str],
    all_visited: Set[str],
) -> None:
    # Check cyclic dependencies.
    if workspace in all_visited:
        if workspace not in parent_set:
            # We reach the end of the chain because we have visited it before.
            return
        parent_chain.append(workspace)
        first_index = parent_chain.index(workspace)
        cyclic_dependency_chain = " -> ".join(parent_chain[first_index:])
        raise Exception(f"Cyclic dependency detected: {cyclic_dependency_chain}.")

    # Check dependencies.
    workspace_dependencies = _get_workspace_information(
        workspaces=workspaces, workspace=workspace
    ).dependencies

    # Visit dependencies.
    all_visited.add(workspace)
    parent_chain.append(workspace)
    parent_set.add(workspace)
    for dependency in workspace_dependencies:
        _construct_dependency_chain(
            workspaces=workspaces,
            workspace=dependency,
            dependency_chain=dependency_chain,
            parent_chain=parent_chain,
            parent_set=parent_set,
            all_visited=all_visited,
        )
    parent_set.remove(workspace)
    parent_chain.pop()
    dependency_chain.append(workspace)


def get_project_workspaces() -> Sequence[str]:
    workspaces = _get_workspaces_information_from_yarn()
    return [workspace for workspace in workspaces.keys() if "common" not in workspace]


def validate_dependency_chain() -> None:
    """
    Throws if there is a cyclic dependency chain.
    """
    workspaces = _get_workspaces_information_from_yarn()
    for workspace in workspaces.keys():
        _construct_dependency_chain(
            workspaces=workspaces,
            workspace=workspace,
            dependency_chain=[],
            parent_chain=[],
            parent_set=set(),
            all_visited=set(),
        )


def get_dependency_chain(workspace: str) -> Sequence[str]:
    dependency_chain: List[str] = []
    _construct_dependency_chain(
        workspaces=_get_workspaces_information_from_yarn(),
        workspace=workspace,
        dependency_chain=dependency_chain,
        parent_chain=[],
        parent_set=set(),
        all_visited=set(),
    )
    return dependency_chain
