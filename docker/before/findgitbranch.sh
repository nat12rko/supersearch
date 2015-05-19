#!/bin/bash
sha1="$(git rev-parse --verify HEAD)"
git branch -r --contains $sha1 |  {
	while read line; do

	latestsha1=$(git rev-parse $line)

	if [[ $line == *"develop"* ]] && [[ $branchname != *"master"* ]] && [[ $sha1 == $latestsha1 ]]
	then
	  branchname=("origin/develop");
	elif [[ $line == *"master"* ]] && [[ $sha1 == $latestsha1 ]]
	then
	  branchname="origin/master";
	elif [[ $branchname != *"master"* ]] && [[ $branchname != *"master"* ]] && [[ $sha1 == $latestsha1 ]]
	then
	  branchname=$line
	fi
	done

	if [ -z $branchname ]
	then
		branchname=$sha1
	fi
    echo "Sha1:"$sha1" branch(or sha1):"$branchname
	echo "git.commit.id.abbrev=""$branchname" > "../../gitbranch.properties"
}

