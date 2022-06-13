FROM alpine:latest

COPY ./ /src/
RUN ln -s /src/bin/nous /bin/nous

RUN apk add --no-cache \
        ruby-mustache \
        bash \
        shellcheck \
        yamllint

RUN ln -s "`gem env gemdir`/bin/mustache" /usr/bin/mustache

WORKDIR /src

#CMD "nous"
CMD sh -c 'while :; do :; done & kill -STOP $! && wait $!'
