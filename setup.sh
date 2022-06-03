#! /bin/bash

# identify distribution

dist=$(lsb_release -a)

# ubuntu/debian
[[ "$dist =~ "buntu" ]] && {
  sudo apt install ruby-mustache
  exit
}


# archlinux base
[[ "$dist =~ "anjaro" ]] && {
  sudo pacman -S mustache
  exit
}
