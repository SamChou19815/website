from typing import Sequence, Tuple
from .configuration import Project, get_projects


def _get_create_status_commands(workflow_name: str) -> str:
    return f"""
      - name: Create Success Status
        uses: actions/github-script@0.2.0
        with:
          github-token: ${{{{ secrets.DEPLOY_GH_PAGE_TOKEN }}}}
          script: |
            github.repos.createStatus({{
              owner: 'SamChou19815',
              repo: 'website',
              sha: '${{{{github.sha}}}}',
              state: 'success',
              context: 'github-actions: {workflow_name}',
              description: 'Passed {workflow_name}!',
            }});
"""


def _get_ci_workspace_build_upload_step(project: Project) -> str:
    workspace = project.workspace
    return f"""
      - name: Build {workspace}
        if: always()
        run: |
          python -m builder.builder build-if-affected \\
            --base-ref ${{{{ github.base_ref }}}} \\
            --head-ref ${{{{ github.head_ref }}}} \\
            --workspace {workspace}
      - name: Collect {workspace} Built Static Assets
        run: cp -R {project.build_output} build/{workspace}
"""


def _generate_frontend_ci_workflow() -> Tuple[str, str]:
    yml_filename = f"generated-ci.yml"
    yml_content = f"""# @generated

name: CI
on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python
        uses: actions/setup-python@v1
        with:
          python-version: '3.7'
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install
      - name: Prepare Built Assets Collector
        run: mkdir build
{"".join(
        [
            _get_ci_workspace_build_upload_step(project=project)
            for project in get_projects()
        ]
    )}
      - name: Upload Built Static Asserts
        uses: actions/upload-artifact@master
        with:
          name: built-assets
          path: build
{_get_create_status_commands("CI")}
"""

    return yml_filename, yml_content


def _get_cd_workspace_build_deploy_step(project: Project) -> str:
    workspace = project.workspace
    return f"""
      - name: Deploy {workspace}
        if: always()
        run: |
          python -m builder.builder build-if-affected \\
            --base-ref ${{{{ github.base_ref }}}} \\
            --head-ref ${{{{ github.head_ref }}}} \\
            --workspace {workspace}
"""


def _generate_frontend_cd_workflow() -> Tuple[str, str]:
    yml_filename = f"generated-cd.yml"
    yml_content = f"""# @generated

name: CD
on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python
        uses: actions/setup-python@v1
        with:
          python-version: '3.7'
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install
      - name: Install Deployment Tools
        run: yarn add --dev firebase-tools react-snap -W
{"".join(
        [
            _get_cd_workspace_build_deploy_step(project=project)
            for project in get_projects()
        ]
    )
}{_get_create_status_commands("CD")}
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    return [
        # CI
        _generate_frontend_ci_workflow(),
        # CD
        _generate_frontend_cd_workflow(),
    ]
