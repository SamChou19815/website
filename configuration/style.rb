# reference: https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md
all
rule 'MD013', :line_length => 100
rule 'MD029', :style => 'ordered'
exclude_rule 'MD002' # First header should be a top level header: font is too big for blog
exclude_rule 'MD033' # No Inline HTML: Too restrictive
exclude_rule 'MD041' # First line should be a top level header: does not work with front-matter
