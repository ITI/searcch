<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/artifact.json'
import Logo from '~/components/Logo.vue'

export default {
  components: { Logo },
  data: () => ({
    schema: {},
    model: {}
  }),
  created() {
    $RefParser.dereference(schemaWithPointers, (err, schema) => {
      if (err) {
        console.error(err)
      } else {
        // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
        // including referenced files, combined into a single object
        console.log(schema)
      }
    })
  }
}
</script>
