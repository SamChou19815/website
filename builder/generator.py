from typing import Sequence, Tuple
from .configuration import Project, get_projects


_BOILERPLATE_SETUP_STEPS: str = """
      - uses: actions/checkout@master
      - name: Set up Python
        uses: actions/setup-python@v1
        with:
          python-version: '3.7'
      - name: Set up Node
        uses: actions/setup-node@v1"""


def _get_ci_workspace_build_job(project: Project) -> str:
    workspace = project.workspace
    return f"""
  build-{workspace}:
    runs-on: ubuntu-latest
    steps:{_BOILERPLATE_SETUP_STEPS}
      - name: Install
        run: |
          python -m builder.builder install-for-build-if-affected \\
              --base-ref ${{ github.base_ref }} \\
              --head-ref ${{ github.head_ref }}
      - name: Build {workspace}
        run: |
          python -m builder.builder build-if-affected \\
            --base-ref ${{{{ github.base_ref }}}} \\
            --head-ref ${{{{ github.head_ref }}}} \\
            --workspace {workspace}"""


def _generate_frontend_ci_workflow() -> Tuple[str, str]:
    yml_filename = f"generated-ci.yml"
    needs_jobs = [f"build-{project.workspace}" for project in get_projects()]
    yml_content = f"""# @generated

name: CI
on: pull_request

jobs:{"".join(
        [
            _get_ci_workspace_build_job(project=project)
            for project in get_projects()
        ]
    )
}
  build:
    runs-on: ubuntu-latest
    needs: [{", ".join(needs_jobs)}]
    steps:
      - name: Success
        run: exit 0
"""

    return yml_filename, yml_content


def _get_cd_workspace_build_deploy_job(project: Project) -> str:
    workspace = project.workspace
    return f"""
  deploy-{workspace}:
    runs-on: ubuntu-latest
    steps:{_BOILERPLATE_SETUP_STEPS}
      - name: Install
        run: python -m builder.builder install-for-deploy-if-affected
      - name: Deploy {workspace}
        run: python -m builder.builder deploy-if-affected --workspace {workspace}"""


def _generate_frontend_cd_workflow() -> Tuple[str, str]:
    yml_filename = f"generated-cd.yml"
    needs_jobs = [f"deploy-{project.workspace}" for project in get_projects()]
    yml_content = f"""# @generated

name: CD
on:
  push:
    branches:
      - master
env:
  FIREBASE_TOKEN: ${{{{ secrets.FIREBASE_TOKEN }}}}

jobs:{"".join(
        [
            _get_cd_workspace_build_deploy_job(project=project)
            for project in get_projects()
        ]
    )
}
  deploy:
    runs-on: ubuntu-latest
    needs: [{", ".join(needs_jobs)}]
    steps:
      - name: Success
        run: exit 0
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    return [
        # CI
        _generate_frontend_ci_workflow(),
        # CD
        _generate_frontend_cd_workflow(),
    ]
