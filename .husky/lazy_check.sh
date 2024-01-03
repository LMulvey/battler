#!/bin/bash

has_changed () {
  [[ $(git diff HEAD@{1}..HEAD@{0} -- ${1} | wc -l) -gt 0 ]]
}
