#!/bin/bash
while read line; do
    key="$( cut -d '=' -f 1 <<< "$line" )"
    value="$( cut -d '=' -f 2- <<< "$line" )"

    if [[ ! -z "$value" ]] && [[ "$value" != " " ]] ; then
        find /etc/resurs -iname '*.properties' -type f -exec sed -i "s#\${$key}#$value#g" {} \;
    fi
done < <(env)
