# Use centos 6 as the base OS
FROM centos:centos6
MAINTAINER liam schauerman

# Install all the things
RUN     yum install -y epel-release git tar which wget python27 unzip curl

# Install nginx
RUN     yum install -y nginx --enablerepo=epel

# Install node
RUN     yum install -y nodejs npm --enablerepo=epel

# Install node, the specific version we need
RUN     npm install -g inherits
RUN     npm install -g n
RUN     n 0.10.31

# Install forever
RUN     npm install -g forever

