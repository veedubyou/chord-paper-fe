#!/bin/sh

GVF=./src/GIT-VERSION-FILE.js
DEF_VER=v2.27.0
GVF2=GIT-VERSION-FILE

LF='
'

# First see if there is a version file (included in release tarballs),
# then try git-describe, then default.
if test -f version
then
        VN=$(cat version) || VN="$DEF_VER"
elif test -d ${GIT_DIR:-.git} -o -f .git &&
        VN=$(git describe --match "v[0-9]*" HEAD 2>/dev/null) &&
        case "$VN" in
        *$LF*) (exit 1) ;;
        v[0-9]*)
                git update-index -q --refresh
                test -z "$(git diff-index --name-only HEAD --)" ||
                VN="$VN-dirty" ;;
        esac
then
        VN=$(echo "$VN" | sed -e 's/-/./g');
else
        VN="$DEF_VER"
fi

VN=$(expr "$VN" : v*'\(.*\)')

if test -r $GVF
then
        VC=$(sed -e 's/^//' <$GVF)
else
        VC=unset
fi
test "$VN" = "$VC" || {
        echo >&2 "$VN"
        echo "const version='$VN'; export default version;" >$GVF
        echo "$VN" > $GVF2
}
