
window.addEventListener('load', () => {
    console.log("Application loaded at", new Date().toISOString());

    const btnTest = document.getElementById('btnTest') as HTMLButtonElement;


    btnTest.addEventListener('click', () => {
        console.log("action btnTest")
    })

})