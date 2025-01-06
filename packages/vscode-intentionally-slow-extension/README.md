# vscode-intentionally-slow-extension

In case you don't know, for some IDE services, VSCode will wait until all providers to return results before displaying results.

This is a demo extension that aims to show the effect of a slow extension on the perceived performance of another extension. It uses TypeScript as an example.

By default, the extension does nothing, so it's safe to be installed at all times. All the slow parts can be toggled on and off independently.

The results since the last test are documented below. If it's outdates, please file an issue.

## Diagnostics

Config: `intentionally-slow-extension.slowErrors`

Result: VSCode will not wait for all extensions' diagnostics. The damage is limited to the slow extension itself.

## Go-to-definition

Config: `intentionally-slow-extension.slowGetDef`

Result: VSCode will wait for all extensions' get-def results. One slow extension can screw up everything.

## Hover

Config: `intentionally-slow-extension.slowHover`

Result: VSCode will not wait for all extensions' hover results. The damage is limited to the slow extension itself.

## Completion

Config: `intentionally-slow-extension.slowCompletion`

Result: VSCode will wait for all extensions' completion results. One slow extension can screw up everything.

## Code Action

Config: `intentionally-slow-extension.slowCodeAction`

Result: VSCode will wait for all extensions' code action results. One slow extension can screw up everything.

## Find-all-references

Config: `intentionally-slow-extension.slowFindRef`

Result: VSCode will wait for all extensions' find-ref results. One slow extension can screw up everything.

## Rename

Config: `intentionally-slow-extension.slowRename`

Result: VSCode will wait for all extensions' renaming results. One slow extension can screw up everything.
