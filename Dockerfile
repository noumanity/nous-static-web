FROM alpine:latest

COPY ./ /src/
RUN ln -s /src/bin/nous /bin/nous

RUN apk add --no-cache \
        ruby-mustache \
        bash

RUN ln -s "`gem env gemdir`/bin/mustache" /usr/bin/mustache

#CMD "nous"
CMD sh -c 'while :; do :; done & kill -STOP $! && wait $!'
