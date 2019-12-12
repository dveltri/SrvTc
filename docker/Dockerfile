FROM postgres AS build

ENV SRS_CONFIGURE_ARGS=""


RUN apt-get update
RUN apt-get update -qq \
  && apt-get install -qq --no-install-recommends software-properties-common git \
   cmake unzip wget ca-certificates build-essential python sudo net-tools \
   libfile-spec-native-perl libcurl4-openssl-dev libssl-dev uuid-dev zlib1g-dev libpulse-dev
RUN apt-get update

WORKDIR /tmp

ADD . /tmp/
RUN mv docker-entrypoint.sh ../

EXPOSE 80 2024 2025 2026 5432 8080
#---------------------------------------
RUN sudo apt -y install mc
RUN sudo apt -y install default-jdk
#RUN sudo apt -y install openjdk-8-jdk
RUN sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
RUN tar xf /tmp/apache-tomcat-9*.tar.gz -C /opt/tomcat
RUN ln -s /opt/tomcat/apache-tomcat-9.0.29 /opt/tomcat/latest
RUN chown -RH tomcat: /opt/tomcat/latest
RUN sh -c 'chmod +x /opt/tomcat/latest/bin/*.sh'
#---------------------------------------
WORKDIR /opt
ENTRYPOINT ["/./docker-entrypoint.sh"]
