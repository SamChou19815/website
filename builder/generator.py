from typing import List, Sequence, Tuple
from .configuration import Project, get_projects


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


def _get_paths_string(project: Project) -> str:
    return "\n".join([f"      - {path}" for path in project.relevant_paths])


def _generate_frontend_ci_workflow(project: Project) -> Tuple[str, str]:
    workspace = project.workspace
    yml_filename = f"generated-ci-{workspace}.yml"
    yml_content = f"""# @generated

name: CI {workspace}
on:
  pull_request:
    paths:
{_get_paths_string(project=project)}

{_get_boilerplate_setup_steps(job_name="build")}
      - name: Build
        run: yarn workspace {workspace} build
"""

    return yml_filename, yml_content


def _generate_frontend_cd_workflow(project: Project) -> Tuple[str, str]:
    workspace = project.workspace
    yml_filename = f"generated-cd-{workspace}.yml"
    yml_content = f"""# @generated

name: CD {workspace}
on:
  push:
    branches:
      - master
    paths:
{_get_paths_string(project=project)}
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
    projects = get_projects()
    workflows: List[Tuple[str, str]] = []
    for project in projects:
        workflows.append(_generate_frontend_ci_workflow(project=project))
        workflows.append(_generate_frontend_cd_workflow(project=project))
    return workflows
