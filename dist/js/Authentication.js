import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const googleButton = document.querySelector('#LoginButton')

googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try{
        const credentials = await signInWithPopup(auth, provider)
        console.log(credentials)

    } catch (error) {
        console.log(error)
    }
})