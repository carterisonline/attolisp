#!/usr/bin/bash

rm debug/*.ts
rm debug/*.js

cp sketch/*.ts debug
sed -i -- 's/\/\/\!\ import/import/g' debug/*.ts
npx tsr debug/sketch.ts
rm debug/*.ts
mkdir -p debug/build
cp debug/sketch.js debug/build/build.js
cp debug/*.js debug/build