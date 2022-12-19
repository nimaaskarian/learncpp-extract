#!/bin/bash

echo_pdf_command(){
  name="$1"-"$2".pdf
  wkhtmltopdf --user-style-sheet no-cookie.css "$3" "$name"
}

node . https://learncpp.com | while read -r line; do 
  echo_pdf_command $line
done
