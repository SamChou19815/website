import os
import subprocess
import shutil
from .configuration import Project


def install_workspace(affected: bool) -> None:
    if not affected:
        print("Website related workspaces are not updated.")
        return

    subprocess.check_call(["yarn", "install"])


def build_workspace(project: Project, affected: bool) -> int:
    workspace = project.workspace

    if affected:
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


def deploy_workspace(project: Project, affected: bool) -> None:
    workspace = project.workspace

    if not affected:
        print(f"{workspace} is not updated.")
        return

    subprocess.check_call(project.build_command.split())
    for one_deploy_command in project.deploy_command:
        subprocess.check_call(one_deploy_command.split())
