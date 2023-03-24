<template>
    <div class="container">
        <div class="row">
        <div class="col-md-12">
            <div>
                <h1>We'll miss you ..</h1>
                <p>
                You have been opted out of the searcch hub. You will no longer be
                notified of new searcch results.
                </p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OptOut',
    mounted() {
        const payload = {
            'email': this.$route.query.email,
            'token': this.$route.query.token
        }
        const response = this.$optOutEndpoint.index(payload)
        // TODO: handle response
    },
};
</script>