export const showDialog = (title: string, content: string) => {
    document.getElementById('dialogTitle').innerText = title;
    document.getElementById('dialogContent').innerText = content;
    (document.getElementById('dialog') as HTMLDialogElement).show();
}