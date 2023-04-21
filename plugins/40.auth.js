export default defineNuxtPlugin(({ $artifactsStore, $userStore, $loginEndpoint }) => {
    const auth = useSession()

    if (auth.status.value === 'authenticated') {
        const payload = {
            strategy: auth.data?.value?.provider,
            token: `Bearer ${auth.data?.value?.token}`,
        }

        $userStore.user_token = payload.token
        $loginEndpoint
            .create(payload)
            .then(response => {
                if (typeof response !== 'undefined' && response.userid >= 0) {
                    $userStore.user = response.person
                    $userStore.userid = response.userid
                    $userStore.user_is_admin = response.is_admin
                    $userStore.user_can_admin = response.can_admin
                    $artifactsStore.fetchFavorites(response.userid)
                }
            })
            .catch(error => {
                console.log('Login error', error)
            })
    }

    return {
        provide: {
            auth: {
                ...auth,
                loggedIn: computed(() => auth.status.value === 'authenticated').value,
                user: computed(() => auth.data?.value?.user).value,
                logout: auth.signOut,
                loginWith: auth.signIn,
            },
        },
    }
})