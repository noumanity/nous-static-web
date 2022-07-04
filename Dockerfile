FROM alpine:latest

COPY ./ /src/
RUN ln -s /src/bin/nous /bin/nous

RUN apk add --no-cache \
        bash \
        shellcheck \
        yamllint


RUN wget https://github.com/cbroglie/mustache/releases/download/v1.3.1/mustache_1.3.1_linux_amd64.tar.gz && \
     tar xf mustache_1.3.1_linux_amd64.tar.gz -C /usr/bin

WORKDIR /src

#ENTRYPOINT "/src/bin/nous"
CMD sh -c 'while :; do :; done & kill -STOP $! && wait $!'
