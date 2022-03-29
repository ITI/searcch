<template>
  <span>
    <div ref="graphContainer"></div>
  </span>
</template>

<script>
import { Network, DataSet } from 'vis-network/standalone/umd/vis-network'

export default {
  name: 'ArtifactRelationshipGraph',
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.draw();
  },
  data() {
    return {
      network: undefined
    }
  },
  methods: {
    draw() {
      let nodes = new DataSet()
      let edges = new DataSet()

      let relationships = [
        ...this.artifact.relationships, 
        ...this.artifact.reverse_relationships
      ]

      let idSet = new Set()
      for (let relationship of relationships) {
        let idFrom = relationship.artifact_id
        let idTo = relationship.related_artifact_id
        if (!idSet.has(idFrom)) {
          nodes.add({ 
            id: idFrom, 
            label: `${idFrom}`,
            borderWidth: idFrom === this.artifact.id ? 7 : 2
          })
          idSet.add(idFrom)
        }
        if (!idSet.has(idTo)) {
          nodes.add({
            id: idTo,
            label: `${idTo}`,
            borderWidth: idTo === this.artifact.id ? 7 : 2
          })
          idSet.add(idTo)
        }
        if (!idSet.has(`${idFrom}-${idTo}`)) {
          edges.add({
            from: idFrom, 
            to: idTo,
            arrows: 'to',
            label: relationship.relation
          })
          idSet.add(`${idFrom}-${idTo}`)
        }
      }

      // create a network
      let container = this.$refs.graphContainer

      // provide the data in the vis format
      let data = { nodes, edges }
      let options = {
        width: '100%',
        height: '400px',
        interaction: {
          dragView: false,
          zoomView: false
        }
      };

      // initialize your network!
      this.network = new Network(container, data, options);
    },
  },
}
</script>