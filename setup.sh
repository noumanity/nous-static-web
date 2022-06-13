#! /bin/bash

# identify distribution

dist=$(lsb_release -a)

# ubuntu/debian
[[ "$dis" =~ "buntu" ]] && {
  sudo apt install -y\
       ruby-mustache\
       yamllint\
       shellcheck
  exit
}


# archlinux base
[[ "$dist" =~ "anjaro" ]] && {
  sudo pacman -S\
       mustache\
       yamllint\
       shellcheck
  exit
}
