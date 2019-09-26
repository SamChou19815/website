import os
import subprocess
import shutil
from fnmatch import fnmatch
from .configuration import Project, create_yarn_workspace_project
from .git import get_changed_paths, get_changed_paths_last_commit


def _project_is_affected(base_ref: str, head_ref: str, project: Project) -> bool:
    for changed_path in get_changed_paths(base_ref=base_ref, head_ref=head_ref):
        for path_pattern in project.relevant_paths:
            if fnmatch(changed_path, path_pattern):
                return True
    return False


def _project_is_affected_last_commit(project: Project) -> bool:
    for changed_path in get_changed_paths_last_commit():
        for path_pattern in project.relevant_paths:
            if fnmatch(changed_path, path_pattern):
                return True
    return False


def build_workspace_if_affected(base_ref: str, head_ref: str, workspace: str) -> int:
    project = create_yarn_workspace_project(workspace=workspace)

    if _project_is_affected(base_ref=base_ref, head_ref=head_ref, project=project):
        print(f"Building {workspace}...")
        return subprocess.call(project.build_command.split())

    # Create dummy file if it's not affected.
    build_output = project.build_output
    if os.path.exists(path=build_output):
        shutil.rmtree(path=build_output)
    os.mkdir(path=build_output)
    message = f"{workspace} is not affected by this change."
    with open(os.path.join(build_output, "README.txt"), "w") as no_change_file:
        no_change_file.write(message)
    print(message)
    return 0


def deploy_workspace_if_affected(workspace: str) -> int:
    project = create_yarn_workspace_project(workspace=workspace)

    if not _project_is_affected_last_commit(project=project):
        print(f"{workspace} is not updated.")
        return 0

    subprocess.call(project.build_command.split())
    for one_deploy_command in project.deploy_command:
        subprocess.call(one_deploy_command.split())
    return 0
