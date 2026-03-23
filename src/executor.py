def process_git_pulse_exclusivity(repository, directive):
    # Check if the directive involves other repositories
    if directive.startswith('open_issue') and repository != 'git-pulse':
        raise ValueError('Cannot open issues on other repositories')
    # Process other directives for git-pulse