import Vue from 'vue'
import { VueShowdown } from 'vue-showdown'
import sanitizeHtml from 'sanitize-html'

const NewVueShowdown = {
    ...VueShowdown,
    computed: {
        ...VueShowdown.computed,
        outputHtml() {
            if (this.converter) {
                this.converter.setFlavor(this.flavor || 'allOn')
                const html = this.converter.makeHtml(this.inputMarkdown)
                return sanitizeHtml(html)
            }
            return ''
        },
    },
}

Vue.component('VueShowdown', NewVueShowdown);
