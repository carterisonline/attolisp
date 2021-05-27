#!/usr/bin/bash

rm release -rf

cp -r ./build ./release
cd release

# Compatibility translations from p5.js to legacy Processing.js
sed -i -- 's/console\.log/println/g' ./*.js
sed -i -- 's/createCanvas/\/\/\ createCanvas/g' ./*.js
sed -ri -- 's/[^\.]push/\ pushMatrix/g' ./*.js
sed -ri -- 's/[^\.]pop/\ popMatrix/g' ./*.js
sed -ri -- 's/print[^l]\s*?/println\(/g' ./*.js
sed -ri -- 's/new\s*?Array\s*?\(\)/new\ Array\(0\)/g' ./*.js
sed -i -- 's/createVector/new\ PVector/g' ./*.js
sed -i -- 's/function\sdraw/\nsetup\(\);\nfunction\ draw/g' ./*.js
sed -i -- 's/windowWidth/width/g' ./*.js
sed -i -- 's/windowHeight/height/g' ./*.js
sed -i -- 's/resizeCanvas/\/\/\ resizeCanvas/g' ./*.js
sed -i -- 's/textFont\(.*\);/textFont\(createFont\1\);/g' ./*.js

prepend() {
    echo -e "$2\n$(cat $1)" > $1
}

packageattr() {
    cat ../package.json | jq -r .$1
}

prepend build.js "//"
prepend build.js "// This projects' source is available at $(packageattr homepage)"
prepend build.js "//"
prepend build.js "//   https://opensource.org/licenses/BSD-3-Clause"
prepend build.js "//   made available under the BSD-3-Clause License"
prepend build.js "// This project uses the p5.ts legacy parser by Carter Reeb"
prepend build.js "//"
prepend build.js "// \"$(packageattr description)\""
prepend build.js "// ----------- $(packageattr name) v$(packageattr version) -----------"