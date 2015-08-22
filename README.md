# Gnome Shell Aws Ec2 extension 
An extension to list a set of active ec2 instances in an AWS account and to easily connect to and terminate those instances from the shell.

The aws cli is used to retrieve a (filtered) list of active ec2 instances. Guake (or gnome-terminal) is used to connect to those instances. For termination the aws-cli is used to send a terminate-instance request

## Prerequisites

### AWS CLI
This extension depends on a working installation of the [AWS CLI tools](https://aws.amazon.com/cli/). 

Distro packages :

* [Arch](https://aur.archlinux.org/packages/aws-cli)

To check if the tools are installed correctly run 'aws ec2 describe-instances' from a terminal. It should list all known instances in the configured account. Add -P profile_name if  multiple profiles are configured.
### Guake
The extensions defaults to [guake](https://github.com/Guake/guake) as the preferred shell with fallback to gnome-terminal.

## Configuration

- **Aws Cli profile** : If configured this profile is used for the aws cli tools 
- **SSH Username**  : The username to use.
- **SSH Key**  : *not implemented yet*
- **AWS Tag Filter Value** : If provided this tag value wil be used as filter to the describe-instance request
- **Bastion Host** : If provided this host wil be used to connect to the ec2 instance (using ssh ProxyCommand)


## Known issues

* The **AWS Tag Filter Value** cannot be left empty. If no filter is to be used '*' should be provided. 
* **SSH Key** usage is not implemented yet. Public key authentication only works with the default key.

## Changelog

* 0.4 Refresh settings on refresh instance list. Show error if aws cli failed
* 0.3 Fix terminate instance bug. Implement refresh action
* 0.2 Add Option to connect through a bastion host with ProxyCommand


