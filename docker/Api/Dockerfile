FROM amazonlinux:latest

LABEL MAINTAINER="Sarah Jabado"

RUN mkdir /app

RUN yum install curl procps tar -y
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
RUN echo "source ~/.nvm/nvm.sh" >> ~/.profile
SHELL ["/bin/bash", "-l", "-c"]
RUN source ~/.profile
RUN nvm install 12.19.0
RUN nvm use 12.19.0
RUN npm --version
COPY ./api /app
COPY ./docker/start.sh /etc/start.sh
RUN chmod +x /etc/start.sh
RUN cd /app && npm ci

WORKDIR /app
CMD ["bash", "/etc/start.sh"]