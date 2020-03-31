FROM postgres AS build
#---------------------------------------
RUN apt-get update
RUN apt-get install -y -qq --no-install-recommends software-properties-common git nano sudo wget net-tools
RUN apt-get install -y -qq --no-install-recommends cmake unzip ca-certificates build-essential python mc
RUN apt-get install -y -qq --no-install-recommends default-jdk tmux

#RUN apt-get install -y -qq openjdk-8-jdk
#RUN apt-get install -y -qq --no-install-recommends libfile-spec-native-perl libcurl4-openssl-dev libssl-dev uuid-dev zlib1g-dev libpulse-dev
#RUN apt-get install -y -qq pgadmin4

RUN apt-get update
#---------------------------------------
ADD logs.log /tmp/
ADD StartDrv.sh /
ADD dgvdb.sh /
ADD docker-entrypoint.sh /
RUN sh -c 'chmod +x /*.sh'
ADD SrvDb* /var/lib/postgresql/data/
#---------------------------------------
RUN useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
ADD apache-tomcat-9.0.29.tar.gz /opt/tomcat/
RUN ln -s /opt/tomcat/apache-tomcat-9.0.29 /opt/tomcat/latest
RUN chown -RH tomcat: /opt/tomcat/latest
RUN sh -c 'chmod +x /opt/tomcat/latest/bin/*.sh'
ADD *.jar /opt/tomcat/latest/lib/
#---------------------------------------
WORKDIR /opt/tomcat/latest/
RUN git clone https://github.com/dveltri/SrvTc.git
RUN mv webapps webappsO
RUN mv SrvTc webapps
RUN rm -rf webappsO
WORKDIR /opt/tomcat/latest/webapps/ROOT/
RUN git clone https://github.com/dveltri/Lp3.git
RUN mv Lp3 lp3
#---------------------------------------
WORKDIR /
EXPOSE 2024 2025 2026 5432 8080
ENTRYPOINT ["/./docker-entrypoint.sh"]
