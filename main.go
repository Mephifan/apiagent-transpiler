package main

import (
	"flag"
	"fmt"
	"github.com/Masterminds/sprig"
	"gopkg.in/yaml.v2"
	"html/template"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

func noescape(str string) template.HTML {
	return template.HTML(str)
}

func main() {
	var flagDatafilePath = flag.String("d", "", "Path to data file which contains YAML or JSON")
	var flagTemplatePath = flag.String("t", "", "Path to tpl file")
	flag.Parse() // more on Flags https://flaviocopes.com/go-command-line-flags/

	dataBytes, readError := ioutil.ReadFile(*flagDatafilePath)
	logIfErr(readError)

	fn := sprig.FuncMap()
	fn["noescape"] = noescape

	var templateData map[string]interface{}
	parseError := yaml.Unmarshal([]byte(dataBytes), &templateData) //reads yaml and json because json is just a subset of yaml
	logIfErr(parseError)

	// services: modify or replace data here
	service, ok := templateData["services"].(interface{})
	if !ok {
		// Handle error here
	}

	// entities: modify or replace data here
	entity, ok := templateData["entity"].(interface{})
	if !ok {
		// Handle error here
	}
	test(entity)

	fmt.Print(service, entity)

	tmpl, templateError := template.New(filepath.Base(*flagTemplatePath)).Funcs(fn).ParseFiles(*flagTemplatePath)
	logIfErr(templateError)

	logIfErr(tmpl.Execute(os.Stdout, templateData))
}

func test(t interface{}) {
	switch e := t.(type) {
	case []interface{}:
		fmt.Print(e)
	}
}

func logIfErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
