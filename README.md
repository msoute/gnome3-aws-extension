# Gnome Shell Aws Ec2 extension 
An extension to list a set of active ec2 instances in an AWS account and to easily connect to and terminate those instances from the shell.

The aws cli is used to retrieve a (filtered) list of active ec2 instances. Guake (or gnome-terminal) is used to connect to those instances. For termination the aws-cli is used to send a terminate-instance request

## Prerequisites

### AWS CLI
This extension depends on a working installation of the [AWS CLI tools](https://aws.amazon.com/cli/). 

Distro packages :

* [Arch](https://www.archlinux.org/packages/community/any/aws-cli/)

To check if the tools are installed correctly run 'aws ec2 describe-instances' from a terminal. It should list all known instances in the configured account. Add -P profile_name if  multiple profiles are configured.
### Guake
The extensions defaults to [guake](https://github.com/Guake/guake) as the preferred shell with fallback to gnome-terminal.

## Configuration

- **Aws Cli profile** : If configured this profile is used for the aws cli tools 
- **SSH Username**  : The username to use.
- **SSH Key**  : *not implemented yet*
- **AWS Tag Filter Value** : If provided this tag value wil be used as filter to the describe-instance request
- **Bastion Host** : If provided this host wil be used to connect to the ec2 instance (using ssh ProxyCommand and the target instance private ip.)


## Known issues

* The **AWS Tag Filter Value** cannot be left empty. If no filter is to be used '*' should be provided. 
* **SSH Key** usage is not implemented yet. Public key authentication only works with the default key.

## Changelog
### 0.12
 * Implement custom identiy file usage (#2)

### 0.11
 * Update for Gnome 3.26
 * Async call to awssdk
 * Add search filter to menu

### 0.10
 * Add option to disable StrictHostKeyChecking

### 0.9
 * Update for Gnome 3.22

### 0.6
 * Update for Gnome 3.20

### 0.5 
 * Fixed connecting without bastion host
 * [Guake] Fixed tab naming on new connection
 
### 0.4 
* Refresh settings on refresh instance list. 
* Show error if aws cli failed

### 0.3 
* Fix terminate instance bug. 
* Implement refresh action
 
### 0.2 
 * Add Option to connect through a bastion host with ProxyCommand


