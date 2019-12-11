FROM postgres AS build
# https://linuxize.com/post/how-to-install-tomcat-9-on-ubuntu-18-04/

ENV SRS_CONFIGURE_ARGS=""


RUN apt-get update -qq \
  && apt-get install -qq --no-install-recommends software-properties-common git \
   cmake unzip wget ca-certificates build-essential python sudo net-tools \
   libfile-spec-native-perl libcurl4-openssl-dev libssl-dev uuid-dev zlib1g-dev libpulse-dev

RUN apt-get install ppa-purge
RUN sudo add-apt-repository ppa:webupd8team/y-ppa-manager
RUN sudo apt-get update
RUN sudo apt-get install y-ppa-manager

WORKDIR /opt;
RUN sudo add-apt-repository ppa:ubuntu-toolchain-r/test && apt-get -qq update;
RUN sudo add-apt-repository universe

ADD . /tmp/
RUN sudo apt-get update
EXPOSE 80 2024 2025 2026 5432 8080
#---------------------------------------
RUN sudo apt -y install mc
RUN sudo apt -y install default-jdk
RUN sudo apt -y install openjdk-8-jdk
RUN sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
RUN tar xf /tmp/apache-tomcat-9*.tar.gz -C /opt/tomcat
RUN ln -s /opt/tomcat/apache-tomcat-9.0.29 /opt/tomcat/latest
RUN chown -RH tomcat: /opt/tomcat/latest
RUN sh -c 'chmod +x /opt/tomcat/latest/bin/*.sh'
#-------------- service ----------------
#ADD tomcat.service /etc/systemd/system/
#RUN systemctl daemon-reload
#RUN systemctl start tomcat
#RUN systemctl enable tomcat
#---------------------------------------
WORKDIR /opt
ENTRYPOINT ["/./docker-entrypoint.sh"]
