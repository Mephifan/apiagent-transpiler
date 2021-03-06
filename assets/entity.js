/**
 * Autogenerated file
 * Create time {{now | toString | noescape}}
 * Copyright (c) 2019 Adcubum AG
 *
 */

import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ApiService} from '/apiService.js'

/**
 * {{ range $key, $service := .services }}`{{$service.name}}`{{ end }}
 */

/**
 * {{.description}}
 */

/**
 * package: {{.package}}
 * version: {{.major_version}}
 */

/**
 * ```
 * {{ range $key, $types := .types }}`{{$types.name}}`
 * {{ range $k, $fields := $types.fields}}
 * - {{$fields.name}} {{$fields.type}} {{ end }}{{ end }}
 *
 * ```
 *
 * @customElement
 * @polymer
 * @extends PolymerElement
 * @appliesMixin ApiService
 * @demo demo/index.html
 */
class {{ range $key, $service := .services }}{{$service.name}}{{ end }}Entity extends ApiService(PolymerElement) {

    static get properties() {
        return {
            /**
             * Exposed attributes
             * Which properties should be exposed?
             */

            /**
             * rawEntity includes all data from the response
             * data, links, ...
             */
            rawEntity: {
                type: Object,
                notify: true,
            },
            /**
             * Model from protocolBuffer definition 'Body'
             */
            entity: {
                type: Object,
                value: () => {
                    return { {{ range $key, $entity := .entity }}
                        /**
                        * {{$entity.description | replace "" "" }}
                        */
                        {{$entity.name}}: {{noescape $entity.default}},{{ end }}
                    }
                },
                notify: true,
            },
            /**
             * Property-Meta informationen
             * extended meta information about the entity
             */
            meta: {
                type: Object,
                value: () => {
                    return { {{ range $key, $entity := .entity }}
                        /**
                        * {{$entity.description | replace "" "" }}
                        */
                        {{$entity.name}}: {
                            description: '{{$entity.description}}',
                            type: '{{$entity.type}}',
                            mandatory: {{$entity.mandatory}},
                        },{{ end }}
                    }
                },
                notify: true,
            },
            /**
             * Hypermedia As The Engine Of Application State (HATEOAS)
             * Array of HATEOAS links
             */
            hateoas: {
                type: Array,
            },

        };
    }

{{ range $key, $service := .services }}{{ range $key, $method := $service.methods}}{{if not (contains "List" $method.name) }}
    /**
     *  ```
     *  rpc {{$method.name}} ({{$method.input_type}}) returns ({{$method.output_type}}) {{"{"}}{{if $method.options}}{{ range $key, $option := $method.options }}
     *      option ({{$option.name}}) = {{"{"}}{{range $key, $var := $option.vars }}
     *          {{$var.key}}: "{{$var.value}}"{{ end }}
     *      {{"}"}};{{ end }}{{ end }}
     *  {{"}"}}
     *  ```
     *  {{$method.description}}
     * @public
     */
    {{ $length := len $method.name }}{{ substr 0 1 $method.name | lower }}{{ substr 1 $length $method.name }}() {
        {{ $hasBody := false }}{{ $isCustom := false }}{{ $httpMethod := "" }}{{$hasParams := false}}{{ $httpUrl := "" }}{{$plainUrl := ""}}{{$custompartUrl := ""}}{{ $allowedMethods := list "get" "post" "patch" "put" "delete" "create" }}
        {{if $method.options}}{{range $key, $options := $method.options }}{{range $key, $var := $options.vars}}{{if has $var.key $allowedMethods }}{{$httpMethod = $var.key | upper}}{{$httpUrl = $var.value}}{{$plainUrl = $var.value}}{{if contains ":" $var.value}}{{$isCustom = true}}{{end}}{{end}}{{if contains $var.key "body"}}{{$hasBody = true}}{{end}}{{end}}{{end}}{{end}}{{if contains "{id}" $httpUrl}}{{$hasParams = true}}{{$plainUrl = (print $httpUrl | replace "{id}" "")}}{{if $isCustom}}{{$customUrl := split ":" $plainUrl}}{{$custompartUrl = (print ":" $customUrl._1)}}{{$plainUrl = $customUrl._0}}{{end}}{{end}}{{if $hasBody}}
        const createRequest = new Request('{{if $hasParams}}{{$plainUrl}}'+this.entity.id{{if $custompartUrl}}+'{{$custompartUrl}}'{{end}}{{else}}{{$plainUrl}}'{{end}}, {
            method: '{{$httpMethod}}',
            headers: {},
        {{if $isCustom}}    body: JSON.stringify(this.customParams){{else}}    body: JSON.stringify(this.entity){{end}}
        });
        this.fieldErrors = this._validateFields();
        if (!this.fieldErrors.error.length){
            this.generateRequest(createRequest);
        }
        {{else}}
        const createRequest = new Request('{{if $hasParams}}{{$plainUrl}}'+this.entity.id{{if $custompartUrl}}+'{{$custompartUrl}}'{{end}}{{else}}{{$plainUrl}}'{{end}}, {
            method: '{{$httpMethod}}',
            headers: {}
        });
        this.generateRequest(createRequest);

        {{end}}
    }
{{end}}{{end}}{{end}}

    /**
     * Inject von einer raw Entity. Normalerweise ein Item aus einer Collection.
     * Ein Inject erstellt eine komplette Entität für die weitere Verwendung.
     * Das Verhalten ist analog wie nach einem get...
     *
     * @event inject-completed(payload: entity Model)
     * @param rawEntity
     * @public
     */
    inject(rawEntity) {

        this._processResponse(rawEntity);
    }

    /**
     * Traversiert durch alle Felder der Entity
     * und ruft die interne Funktion '_validateField(fieldId)' auf.
     * @return fieldError{}
     * @private
     */
    _validateFields(){
        for (let f in this.entity){
            if (this.entity.hasOwnProperty(f)) {
                this.fieldErrors = this._validateField(f);
            }
        }
        return this.fieldErrors;
    }

    /**
     * - Ruft pro Feld den Standardvalidator des apiService auf.
     * - Ruft - falls vorhanden - die dynamischen Validierungsfunktionen aus den Metainformationen auf.
     * @param fieldId
     * @return fieldError{}
     * @private
     */
    _validateField(fieldId) {
        this.fieldErrors = super._validateField(fieldId);
        console.log('entity validateField:', fieldId);

        // custom validation function from meta
        if (typeof this.meta[fieldId].validate === 'function'){
            this.fieldErrors = this.meta[fieldId].validate(this);
        }
        return this.fieldErrors;
    }

}

window.customElements.define('{{ range $key, $service := .services }}{{$service.name | snakecase | replace "_" "-" | camelcase | lower}}-entity{{ end }}', {{ range $key, $service := .services }}{{$service.name}}Entity{{ end }});




