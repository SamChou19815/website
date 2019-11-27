from typing import List, Sequence, Tuple
from .workspace import get_project_workspaces, get_dependency_chain


def _get_boilerplate_setup_steps(job_name: str) -> str:
    return (
        f"jobs:\n  {job_name}"
        + """:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python
        uses: actions/setup-python@v1
        with:
          python-version: '3.7'
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Use Yarn Cache
        uses: actions/cache@v1
        with:
          path: ~/.cache/yarn
          key: yarn-${{ hashFiles(format('{0}{1}', github.workspace, '/yarn.lock')) }}
          restore-keys: yarn-
      - name: Yarn Install
        run: yarn install"""
    )


def _get_paths_string(workspace: str) -> str:
    all_paths = [
        *[f"{dependency}/**" for dependency in get_dependency_chain(workspace)],
        "package.json",
        "yarn.lock",
        "configuration/**",
        f"{workspace}/package.json",
        f".github/workflows/generated-*-{workspace}.yml",
    ]
    return "\n".join([f"      - {path}" for path in all_paths])


def _generate_frontend_ci_workflow(workspace: str) -> Tuple[str, str]:
    yml_filename = f"generated-ci-{workspace}.yml"
    yml_content = f"""# @generated

name: CI {workspace}
on:
  pull_request:
    paths:
{_get_paths_string(workspace=workspace)}

{_get_boilerplate_setup_steps(job_name="build")}
      - name: Build
        run: yarn workspace {workspace} build
"""

    return yml_filename, yml_content


def _generate_frontend_cd_workflow(workspace: str) -> Tuple[str, str]:
    yml_filename = f"generated-cd-{workspace}.yml"
    yml_content = f"""# @generated

name: CD {workspace}
on:
  push:
    branches:
      - master
    paths:
{_get_paths_string(workspace=workspace)}
env:
  FIREBASE_TOKEN: ${{{{ secrets.FIREBASE_TOKEN }}}}

{_get_boilerplate_setup_steps(job_name="deploy")}
      - name: Build
        run: yarn workspace {workspace} build
      - name: Deploy
        run: yarn workspace {workspace} deploy
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    workflows: List[Tuple[str, str]] = []
    for workspace in get_project_workspaces():
        workflows.append(_generate_frontend_ci_workflow(workspace=workspace))
        workflows.append(_generate_frontend_cd_workflow(workspace=workspace))
    return workflows
