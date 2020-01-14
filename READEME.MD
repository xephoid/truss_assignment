# Zeke Swepson

## Truss Software Engineering Interview
On thing I'm not 100% sure on is if non-utf8 characters were converted to the 
correct amount of Unicode Replacement Characters. I suspect that would take me
too many hours to figure out.

I included a sample output file.csv

## Environment
This code was written and tested in Ubuntu 18.04 LTS (16.04 should work fine)
with Node v10.14.1.

## How to run

```sh
npm i
./script.js < sample.csv > output.csv
```