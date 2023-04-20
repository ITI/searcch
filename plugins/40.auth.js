export default defineNuxtPlugin(() => {
    const auth = useSession()

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