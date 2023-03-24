<template>
    <div class="container">
        <div class="row">
        <div class="col-md-12">
            <div v-if="loading">
                <h1>Opting out ...</h1>
                <p>Please wait while we process your request.</p>
            </div>
            <div v-else-if="error">
                <h1>Error</h1>
                <p>{{ errorMsg }}</p>
            </div>
            <div v-else>
                <h1>We'll miss you ..</h1>
                <p>You have been opted out of the searcch hub. You will no longer be notified of new searcch results.</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OptOut',
    async mounted() {
        const payload = {
            'email': this.$route.query.email,
            'key': this.$route.query.key
        }
        if (!payload.email || !payload.key) {
            this.$router.push('/')
        }

        this.loading = true
        await this.$optOutEndpoint.index(payload)
        .then(response => {
            this.loading = false
        })
        .catch(error => {
            this.loading = false
            this.errorMsg = error.message
        })
    },
    data() {
        return {
            loading: true,
            errorMsg: ''
        }
    }
};
</script>